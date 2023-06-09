"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "../Context/store";
import { Supplements, TransformedSupplements } from "../types";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { formatISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, XCircle } from "lucide-react";
import LoadingSpinner from "../(shared)/LoadingSpinner";

type Props = {};

const SuplementList = (props: Props) => {
  const { toast } = useToast();
  const { selectedDate, supplements, setSupplements, loading } =
    useGlobalContext();
  const [daySupplements, setDaySupplements] = useState<
    TransformedSupplements[]
  >([]);
  const [newSupp, setNewSupp] = useState("");
  const [isNewSupp, setIsNewSupp] = useState(false);
  const [isLoading, setIsLoading] = useState({
    index: 0,
    state: false,
  });

  useEffect(() => {
    const trasformedArray = supplements.map((supplement) => {
      return {
        name: supplement.name,
        isTaken:
          supplement.supplementLogs && supplement.supplementLogs[0]
            ? supplement.supplementLogs[0].isTaken
            : false,
        id: supplement.id,
        logId:
          supplement.supplementLogs && supplement.supplementLogs[0]
            ? supplement.supplementLogs[0].id
            : 0,
      };
    });
    setDaySupplements(trasformedArray);
  }, [selectedDate, supplements, setSupplements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/supplements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSupp,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("New Supplement Added: ", data);
        setSupplements((supplements) => [
          ...supplements,
          {
            ...data,
          },
        ]);
        setIsNewSupp(false);
        setNewSupp("");
        toast({
          description: `${newSupp} added to suplement list!`,
        });
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const handleDelete = async (supplementId: number, supplementName: string) => {
    const response = await fetch(`/api/supplements/${supplementId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setSupplements(
      supplements.filter((supplement, i) => supplement.id !== supplementId)
    );
    const data = await response.json();
    console.log(data);
    toast({
      description: `${supplementName} removed from list!`,
    });
  };

  const handleUpdateExisting = async (
    supplementId: number,
    logId: number,
    checked: boolean,
    idx: number
  ) => {
    try {
      setIsLoading({
        index: idx,
        state: true,
      });
      const response = await fetch(
        `/api/supplements/${supplementId}/logs/${logId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isTaken: checked,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const updatedArray = supplements.map((supplement) => {
          return {
            ...supplement,
            supplementLogs:
              supplement.id === supplementId
                ? [data]
                : supplement.supplementLogs,
          };
        });

        setSupplements(updatedArray);
        setIsLoading({
          index: 0,
          state: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateNew = async (supplementId: number) => {
    try {
      const response = await fetch(`/api/supplements/${supplementId}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day: formatISO(selectedDate as Date),
          isTaken: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const updatedArray = supplements.map((supplement) => {
          return {
            ...supplement,
            supplementLogs:
              supplement.id === supplementId
                ? [data]
                : supplement.supplementLogs,
          };
        });

        setSupplements(updatedArray);
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return (
    <Card className="relative h-full w-full">
      <CardHeader>
        <div className="flex justify-between items-center gap-3 overflow-auto">
          {/* <BoxHeader>Supplements</BoxHeader> */}
          <CardTitle>Supplements</CardTitle>
          <Button
            // className="text-neutral-400 hover:text-white"
            onClick={() => setIsNewSupp(true)}
            disabled={loading as boolean}
            variant={"default"}
            size={"icon"}
          >
            <Plus size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="h-64 px-2 mt-2 mb-4 shadow-none"
          placeholder="Poop"
        >
          {daySupplements &&
            daySupplements.map((supplement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 mb-4 group transition-transform relative"
              >
                {isLoading.index === index && isLoading.state ? (
                  <LoadingSpinner />
                ) : (
                  <Checkbox
                    className="duration-300"
                    id={supplement.name}
                    checked={supplement.isTaken}
                    onCheckedChange={(checked) => {
                      supplement.logId === 0
                        ? handleUpdateNew(supplement.id)
                        : handleUpdateExisting(
                            supplement.id,
                            supplement.logId,
                            checked as boolean,
                            index
                          );
                    }}
                  />
                )}
                <Label
                  htmlFor={supplement.name}
                  className="text-md text-card-foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {supplement.name}
                </Label>
                <div
                  className="invisible group-hover:visible absolute right-3 cursor-pointer"
                  onClick={() => handleDelete(supplement.id, supplement.name)}
                >
                  <XCircle
                    className="text-destructive hover:fill-destructive hover:text-background"
                    size={16}
                  />
                </div>
              </div>
            ))}
          {isNewSupp && (
            <form
              className="flex items-center space-x-3 mb-4 group transition-transform"
              onSubmit={handleSubmit}
            >
              <Checkbox disabled />
              <Input
                autoFocus
                className="m-0 p-0 text-md text-card-foreground leading-none border-none ring-0 focus-visible:ring-0 h-5"
                onBlur={() => setIsNewSupp(false)}
                placeholder="Add new supplement"
                type="text"
                value={newSupp}
                onChange={(e) => setNewSupp(e.target.value)}
              />
            </form>
          )}
        </ScrollArea>
      </CardContent>

      {/* <div className="absoute bottom-2 w-full h-10 flex items-center justify-center cursor-pointer bg-[#c6ced6] hover:bg-[#a8bbd1] rounded-lg mt-1">
        {!isNewSupp ? (
          <div
            className="flex shadow-sm items-center justify-center h-ful w-full"
            onClick={() => setIsNewSupp(true)}
          >
            <AiOutlinePlus size={14} className="text-black" />
          </div>
        ) : (
          <form className="w-full h-fit" onSubmit={handleSubmit}>
            <Input
              id="vitaminName"
              type="text"
              value={newSupp}
              placeholder="Add new supplement..."
              onBlur={() => setIsNewSupp(false)}
              autoFocus={true}
              className="relative w-full my-0 text-black"
              onChange={(e) => setNewSupp(e.target.value)}
            />
          </form>
        )}
      </div> */}
    </Card>
  );
};

export default SuplementList;
