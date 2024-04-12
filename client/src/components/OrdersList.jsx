import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Order = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
        <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.order.drink_name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.order.customer_name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.order.order_time}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {JSON.stringify(props.order.update_info)}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteOrder(props.order._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  // This method fetches the orders from the database.
  useEffect(() => {
    async function getOrders() {
      const response = await fetch(`http://localhost:5858/order/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const orders = await response.json();
      setOrders(orders);
    }
    getOrders();
    return;
  }, [orders.length]);

  // This method will delete a order
  async function deleteOrder(id) {
    await fetch(`http://localhost:5858/order/${id}`, {
      method: "DELETE",
    });
    const newOrders = orders.filter((el) => el._id !== id);
    setOrders(newOrders);
  }

  // This method will map out the orders on the table
  function orderList() {
    return orders.map((element) => {
      return (
        <Order
          order={element}
          deleteOrder={() => deleteOrder(element._id)}
          key={element._id}
        />
      );
    });
  }

  // This following section will display the table with the order of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Orders</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Drink Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Customer Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Order Time
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Telegram Update Info
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {orderList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
