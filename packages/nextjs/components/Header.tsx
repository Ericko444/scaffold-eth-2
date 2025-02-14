"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Mes propriétés",
    href: "/myLands",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Mes demandes",
    href: "/myRequests",
  },
  {
    label: "Vente aux enchères",
    href: "/auction",
  },
  {
    label: "Explorer",
    href: "/explore",
  },
];

export const menuLinksAdmin: HeaderMenuLink[] = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Propriétés du gouvernement",
    href: "/gov",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Explorer",
    href: "/explore",
  },
  {
    label: "Vente aux enchères",
    href: "/auction",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { address: connectedAddress } = useAccount();
  const linksToUse = connectedAddress === "0x1a98EbD96CDB77A8Ea6cE8Bc3EcCd3B449712c7B" ? menuLinksAdmin : menuLinks;

  return (
    <>
      {linksToUse.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${isActive ? "bg-secondary shadow-md" : ""
                } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { address: connectedAddress } = useAccount();
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  useScaffoldWatchContractEvent({
    contractName: "LandRegistry",
    eventName: "ExchangeRequested",
    onLogs: logs => {
      logs.map(log => {
        const { exchangeId, owner2 } = log.args;
        if (connectedAddress === owner2) {
          notification.success("Vous avez recu une demande d'échange");
          console.log("📡 ExchangeRequested event", exchangeId);
        }
      });
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "LandRegistry",
    eventName: "ExchangeAccepted",
    onLogs: logs => {
      logs.map(log => {
        const { exchangeId, owner1 } = log.args;
        if (connectedAddress === owner1) {
          notification.success("Votre demande d'échange a été accepté");
          console.log("📡 ExchangeAccepted event", exchangeId);
        }
      });
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "LandRegistry",
    eventName: "AuctionStarted",
    onLogs: logs => {
      logs.map(log => {
        if (connectedAddress !== '0x1a98EbD96CDB77A8Ea6cE8Bc3EcCd3B449712c7B') {
          notification.success("Une nouvelle enchère a commencé");
        }
      });
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "LandRegistry",
    eventName: "AuctionEnded",
    onLogs: logs => {
      logs.map(log => {
        const { winner } = log.args;
        if (connectedAddress === winner) {
          notification.success("Félicitation vous avez remporté l'enchère");
          console.log("📡 AuctionEnded event winner", winner);
        }
      });
    },
  });

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Madaterra</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
