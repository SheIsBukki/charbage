"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createTag } from "@/db/queries/insert";
import { TagFormSchema } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TagForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(TagFormSchema),
    defaultValues: { name: "", description: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: { name: string; description: string }) => {
    const parsed = TagFormSchema.safeParse(data);

    if (!parsed.success) {
      return { errors: parsed.error.flatten() };
    }

    const tag = await createTag(parsed.data.name, parsed.data.description);

    if (tag.error && tag.error === "Sorry, tag already exists") {
      toast.error("Sorry, tag already exists");
    } else if (tag.tag) {
      toast.success("Tag successfully created!");
    }

    reset();
    return tag;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create a Tag</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a tag</DialogTitle>
          <DialogDescription className="">
            Create a unique tag and description
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="">
            {/*<Label htmlFor="name" className="text-right">
                Name
              </Label>*/}

            <Input
              id="name"
              type="text"
              {...register("name")}
              className=""
              placeholder="Tag name"
            />
            {errors.name && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-500 md:text-base"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="">
            {/*<Label htmlFor="description" className="text-right">
                Description
              </Label>*/}

            <Textarea
              id="description"
              {...register("description")}
              className=""
              placeholder="Tag description"
              maxLength={300}
              minLength={5}
            />
            {errors.description && (
              <p
                role="alert"
                className="mt-1 text-xs text-red-500 md:text-base"
              >
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              onSubmit={handleSubmit(onSubmit)}
              type="submit"
              className=""
            >
              Create tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
