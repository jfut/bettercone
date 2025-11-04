"use client";

import { UserButton, SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Github, IceCreamCone } from "lucide-react";

export function Header() {

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container max-w-6xl mx-auto px-4">
				<div className="flex h-14 items-center justify-between">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 transition-opacity hover:opacity-80"
					>
						<IceCreamCone className="w-5 h-5 text-primary" />
						<span className="font-semibold text-base">
							BetterCone
						</span>
					</Link>

					{/* Navigation */}
					<nav className="hidden md:flex items-center gap-6">
						<Link
							href="https://docs.bettercone.com"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							Documentation
						</Link>
						<Link
							href="https://github.com/vncsleal/bettercone"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							<Github className="h-3.5 w-3.5" />
							GitHub
						</Link>
					</nav>

					{/* Right Section */}
					<div className="flex items-center gap-2">
						<SignedIn>
							<UserButton size="icon" />
						</SignedIn>

						<SignedOut>
							<Button variant="ghost" size="sm" asChild>
								<Link href="/auth/sign-in">Sign In</Link>
							</Button>
							<Button size="sm" asChild>
								<Link href="/auth/sign-up">Sign Up</Link>
							</Button>
						</SignedOut>

						<ModeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
