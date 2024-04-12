import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";


const Matched = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.matched.rule_id}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.matched.order_id}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.matched.matched_time}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteMatched(props.matched._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function MatchedList() {
  const [matched, setMatched] = useState([]);

  // This method fetches the recipes from the database.
  useEffect(() => {
    async function getMatched() {
      const response = await fetch(`http://localhost:5858/matched/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const recipes = await response.json();
      setMatched(recipes);
    }
    getMatched();
    return;
  }, [matched.length]);

  // This method will delete a matched
  async function deleteMatched(id) {
    await fetch(`http://localhost:5858/matched/${id}`, {
      method: "DELETE",
    });
    const newRecipes = matched.filter((el) => el._id !== id);
    setMatched(newRecipes);
  }

  // This method will map out the matched on the table
  function matchedList() {
    return matched.map((element) => {
      return (
        <Matched
          matched={element}
          deleteMatched={() => deleteMatched(element._id)}
          key={element._id}
        />
      );
    });
  }

  // This following section will display the table with the matched of individuals.
  return (
    <>

      <div className="flex items-center mb-6">
        <h3 className="text-lg font-semibold p-4">Matched</h3>
        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/createMatched">
          Create New Matched
        </NavLink>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Rule ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Order ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Matched Time
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {matchedList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
