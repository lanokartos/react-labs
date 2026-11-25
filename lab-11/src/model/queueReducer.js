/**
 * Ред'юсер черги замовлень. Його написав колега; у нього черга працює.
 *
 * Стан: { orders: [...] }. Кожне замовлення — як у src/data/orders.js:
 *   { id, number, status, customer: { id, name }, items: [...] }
 * status — колонка на дошці: 'new' («Нові»), 'brewing' («Готуються»),
 * 'ready' («Готові») або 'served' («Видані»).
 *
 * Дії — події на сторінці:
 *   { type: 'order_placed', order: { id, customer: { id, name }, items } }
 *       бариста надіслав нове замовлення з форми. Номер і статус 'new'
 *       дає ред'юсер, кожен напій отримує done: false. id замовлення й
 *       гостя створює обробник події.
 *   { type: 'item_toggled', orderId, itemId }
 *       бариста відмітив напій готовим або зняв позначку
 *   { type: 'order_advanced', orderId }
 *       бариста натиснув «Почати», «Готово» чи «Видати»: замовлення
 *       переходить у наступну колонку
 *   { type: 'order_cancelled', orderId }
 *       бариста натиснув «Скасувати замовлення»
 *   { type: 'customer_renamed', customerId, name }
 *       бариста виправив ім'я гостя в «Деталях»
 *
 * Компоненти й тести читають стан лише через selectColumn і selectOrder
 * унизу файлу.
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const ordersById = {}
  const orderIds = []
  const customersById = {}
  const customerIds = []

  for (const order of orders) {
    orderIds.push(order.id)
    ordersById[order.id] = {
      id: order.id,
      number: order.number,
      status: order.status,
      customerId: order.customer.id,
      items: order.items,
    }

    if (!customersById[order.customer.id]) {
      customerIds.push(order.customer.id)
      customersById[order.customer.id] = {
        id: order.customer.id,
        name: order.customer.name,
      }
    }
  }

  const lastNumber = Math.max(...orders.map((o) => o.number))

  return {
    orders: {
      byId: ordersById,
      ids: orderIds,
    },
    customers: {
      byId: customersById,
      ids: customerIds,
    },
    lastNumber,
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const nextNumber = state.lastNumber + 1
      const { id: orderId, customer, items } = action.order
      const customerId = customer.id

      const newOrder = {
        id: orderId,
        number: nextNumber,
        status: 'new',
        customerId,
        items: items.map((item) => ({ ...item, done: false })),
      }

      let customers = state.customers
      if (!state.customers.byId[customerId]) {
        customers = {
          byId: {
            ...state.customers.byId,
            [customerId]: { id: customer.id, name: customer.name },
          },
          ids: [...state.customers.ids, customerId],
        }
      }

      return {
        ...state,
        lastNumber: nextNumber,
        orders: {
          byId: {
            ...state.orders.byId,
            [orderId]: newOrder,
          },
          ids: [...state.orders.ids, orderId],
        },
        customers,
      }
    }

    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      const updatedOrder = {
        ...order,
        items: order.items.map((item) =>
          item.id === action.itemId ? { ...item, done: !item.done } : item,
        ),
      }

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: updatedOrder,
          },
        },
      }
    }

    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      const updatedOrder = {
        ...order,
        status: nextStatus[order.status],
      }

      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: updatedOrder,
          },
        },
      }
    }

    case 'order_cancelled': {
      const remainingById = { ...state.orders.byId }
      delete remainingById[action.orderId]
      const remainingIds = state.orders.ids.filter(
        (id) => id !== action.orderId,
      )

      return {
        ...state,
        orders: {
          byId: remainingById,
          ids: remainingIds,
        },
      }
    }

    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      const updatedCustomer = { ...customer, name: action.name }

      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [action.customerId]: updatedCustomer,
          },
        },
      }
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => state.orders.byId[id])
    .filter((order) => order.status === status)
    .map((order) => ({
      ...order,
      customer: state.customers.byId[order.customerId],
    }))
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined
  return {
    ...order,
    customer: state.customers.byId[order.customerId],
  }
}
