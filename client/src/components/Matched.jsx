import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Matched() {
  const [form, setForm] = useState({
    rule_id: "",
    order_id: "",
    matched_time: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const formData = { ...form };
    try {
      let response;
      // if we are adding a new rulr we will POST to /matched.
      response = await fetch("http://localhost:5858/matched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred adding or updating a matched: ', error);
    } finally {
      setForm({
        name: "",
        code: "",
        ingredients: "",
        valid: true
      });
      navigate("/listMatched");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create Matched</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">

            <div className="sm:col-span-4">
              <label
                htmlFor="regex_rule"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Rule ID
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="rule_id"
                    id="rule_id"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Rule ID"
                    value={form.rule_id}
                    onChange={(e) => updateForm({ rule_id: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="regex_rule"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Order ID
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="order_id"
                    id="order_id"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Order ID"
                    value={form.order_id}
                    onChange={(e) => updateForm({ order_id: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="regex_rule"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Matched Time
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="datetime"
                    name="matched_time"
                    id="matched_time"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Ingredients"
                    value={form.matched_time}
                    onChange={(e) => updateForm({ matched_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        <input
          type="submit"
          value="Save Matched"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
