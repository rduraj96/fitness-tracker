"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dispatch, SetStateAction, useState } from "react";
import { ChevronDown } from "lucide-react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Props = {
  protein: Checked;
  setProtein: Dispatch<SetStateAction<Checked>>;
  carbs: Checked;
  setCarbs: Dispatch<SetStateAction<Checked>>;
  fat: Checked;
  setFat: Dispatch<SetStateAction<Checked>>;
};

export function DropdownMenuCheckboxes({ ...Props }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="group p-2 gap-2">
          {/* <div className="flex items-center justify-center gap-2 text-neutral-400"> */}
          {"Filter"}
          <ChevronDown
            className="group-hover:rotate-180 rotate-0 transform duration-100"
            size={14}
          />
          {/* </div> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Show</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={Props.protein}
          onCheckedChange={Props.setProtein}
        >
          Protein
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={Props.carbs}
          onCheckedChange={Props.setCarbs}
        >
          Carbs
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={Props.fat}
          onCheckedChange={Props.setFat}
        >
          Fat
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
