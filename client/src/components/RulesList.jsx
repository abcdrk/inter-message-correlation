import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";


const Rule = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.rule.drink_name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.rule.ingredients}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.rule.end_time}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.rule.cpee_callback}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        {/* <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/editRule/${props.rule._id}`}
        >
          Edit
        </Link> */}
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRule(props.rule._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RulesList() {
  const [rules, setRules] = useState([]);

  // This method fetches the rules from the database.
  useEffect(() => {
    async function getRules() {
      const response = await fetch(`http://localhost:5858/rule/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const rules = await response.json();
      setRules(rules);
    }
    getRules();
    return;
  }, [rules.length]);

  // This method will delete a rule
  async function deleteRule(id) {
    await fetch(`http://localhost:5858/rule/${id}`, {
      method: "DELETE",
    });
    const newRules = rules.filter((el) => el._id !== id);
    setRules(newRules);
  }

  // This method will map out the rules on the table
  function ruleList() {
    return rules.map((element) => {
      return (
        <Rule
          rule={element}
          deleteRule={() => deleteRule(element._id)}
          key={element._id}
        />
      );
    });
  }

  // This following section will display the table with the rules of individuals.
  return (
    <>

      <div className="flex items-center mb-6">
        <h3 className="text-lg font-semibold p-4">Rules</h3>
        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/createRule">
          Create New Rule
        </NavLink>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Drink Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Ingredients
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  End Time
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  CPEE CALLBACK URL
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {ruleList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
