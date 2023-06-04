import React from "react";
import MacroBar from "./MacroBar";
import { Meal } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  meal: Meal;
};

const TableRow = ({ meal }: Props) => {
  const images = {
    Breakfast: "https://i.gyazo.com/5a3032c18809460607b9699fe7c06aa1.png",
    Lunch: "https://i.gyazo.com/f28d12efcdd67d4a8babb00f20768237.png",
    Dinner: "https://i.gyazo.com/08c04aac06126db7062ada26437943ac.png",
    Snack: "https://i.gyazo.com/8b8bdba3bd3a4dbd39464162343ed96f.png",
  };
  return (
    <div className="w-full text-gray-300 text-sm h-14 bg-foreground flex justify-between items-center rounded-xl mb-4 px-6 cursor-pointer">
      <div className="basis-2/4 text-left">
        <div className="flex items-center justify-start gap-3">
          <Avatar className="rounded-xl aspect-auto h-8 w-8">
            <AvatarImage src={images[`${meal.type as keyof typeof images}`]} />
            <AvatarFallback>Food</AvatarFallback>
          </Avatar>
          {meal.name}
        </div>
      </div>
      {/* <div className="basis-1/4 text-center">{meal.type}</div> */}
      <div className="basis-1/4">
        <MacroBar meal={meal} />
      </div>
      <div className="basis-1/4 text-right">{meal.calories}</div>
    </div>
  );
};

export default TableRow;