"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, ScaleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useFetchBlocks, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useState } from "react";
import { PaginationButton, SearchBar, TransactionsTable } from "./blockexplorer/_components";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } = useFetchBlocks();
  const { targetNetwork } = useTargetNetwork();
  const [isLocalNetwork, setIsLocalNetwork] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Bienvenue sur</span>
            <span className="block text-4xl font-bold">Madaterra</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Adresse connectée:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <ShoppingCartIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explorer notre{" "}
                <Link href="/debug" passHref className="link">
                  Marketplace
                </Link>{" "}
                ou vous pourrez vendre, acheter, et échanger vos terrains
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <ScaleIcon className="h-8 w-8 fill-secondary" />
              <p>
                Participez aux {" "}
                <Link href="/explore" passHref className="link">
                  Ventes aux enchères
                </Link>{" "}
                pour acquérir des propriétés exclusifs
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Recherchez les terrains qu'il vous faut grace à notre{" "}
                <Link href="/explore" passHref className="link">
                  Outil de recherche
                </Link>{" "}
                boosté avec l'IA.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto my-10">
        <SearchBar />
        <TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts} />
        <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} />
      </div>
    </>
  );
};

export default Home;
