import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";

import { z } from "zod";

const schema = z.object({
  firstname: z.string().nonempty({ message: "Name is required" }),
  lastname: z.string().nonempty({ message: "Last name is required" }),
  email: z.string().email(),
  interests: z.array(
    z.object({
      interest: z.string(),
    })
  ),
});

type FormFields = z.infer<typeof schema>;

// type FormFields = {
//   email: string;
//   password: string;
// };

function App() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      interests: [{ interest: "" }],
    },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "interests",
    control,
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    alert("Your application has been successfully sent!");
    reset();
  };

  return (
    <>
      <h2>Dynamic form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="dynamicForm">
        <input
          {...register("firstname")}
          type="text"
          placeholder="First name"
        />
        {errors.firstname && (
          <div className="error">{errors.firstname.message}</div>
        )}

        <input {...register("lastname")} type="text" placeholder="Last name" />
        {errors.lastname && (
          <div className="error">{errors.lastname.message}</div>
        )}

        <input
          {...register("email")}
          // {...register("email", {
          //   required: "Email is required",
          //   pattern: {
          //     value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          //     message: "Invalid email address",
          //   },
          //   //validate: (value)=>value.includes("@"), personal validation
          // })}
          type="text"
          placeholder="Email"
        />

        {errors.email && <div className="error">{errors.email.message}</div>}

        {fields.map((fields, index) => {
          return (
            <div className="interests" key={fields.id}>
              <input
                {...register(`interests.${index}.interest`)}
                type="text"
                placeholder="Your interests"
              />
              <button
                className="delete"
                type="button"
                onClick={() => remove(index)}
              >
                Delete
              </button>
            </div>
          );
        })}

        <a
          className="add"
          type="button"
          onClick={() => {
            append({
              interest: "",
            });
          }}
        >
          Add more interests
        </a>

        <button className="submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
}

export default App;
