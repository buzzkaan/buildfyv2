import { prisma } from "@/lib/db";
import React from "react";

const Page = async () => {
  const users = await prisma.user.findMany();
  return <div className="">{JSON.stringify(users, null, 2)}</div>;
};

export default Page;
