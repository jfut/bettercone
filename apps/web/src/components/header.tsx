"use client";

import { UserButton, SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function Header() {
	const pathname = usePathname();
	const router = useRouter();

	// Show back button on demo pages (anything under /demo/)
	const showBackButton = pathname.startsWith("/demo/");

	const handleBack = () => {
		router.back();
	};

	return (
		<header className="fixed top-4 left-0 right-0 z-50">
			<div className="container max-w-7xl mx-auto px-2">
				<div className="flex items-center justify-center py-4">
					<div className="flex items-center w-full">
						{showBackButton && (
							<Button
								variant="outline"
								size="icon"
								onClick={handleBack}
								className="mr-4 h-10 w-10 animate-in slide-in-from-left-2 duration-300"
								aria-label="Go back"
							>
								<ArrowLeft className="h-4 w-4" />
							</Button>
						)}

						<Card className="flex-1 px-6 py-1">
							<div className="flex items-center justify-between h-10">
								<div className="flex items-center gap-4">
									<Link href="/" className="flex items-center transition-opacity">
										<Image
											src="/better-auth-logo-light.svg"
											alt="Better Auth"
											width={128}
											height={32}
											className="h-8 w-auto dark:hidden"
										/>
										<Image
											src="/better-auth-logo-dark.svg"
											alt="Better Auth"
											width={128}
											height={32}
											className="h-8 w-auto hidden dark:block"
										/>
									</Link>
								</div>

								<div className="flex items-center gap-4">
									<SignedIn>
										<nav className="hidden md:flex items-center gap-6 text-sm">
											<Link
												href="/demo"
												className={`font-medium hover:text-primary transition-colors ${
													pathname.startsWith("/demo") ? "text-primary" : ""
												}`}
											>
												Demo
											</Link>
											<Link
												href="/examples"
												className={`font-medium hover:text-primary transition-colors ${
													pathname.startsWith("/examples") ? "text-primary" : ""
												}`}
											>
												Examples
											</Link>
											<Link
												href="https://github.com/daveyplate/better-auth-nextjs-convex-starter"
												target="_blank"
												rel="noopener noreferrer"
												className="font-medium hover:text-primary transition-colors"
											>
												GitHub
											</Link>
										</nav>
										<UserButton size="icon" />
									</SignedIn>

									<SignedOut>
										<nav className="hidden md:flex items-center gap-6 text-sm mr-4">
											<Link
												href="/demo"
												className="font-medium hover:text-primary transition-colors"
											>
												Demo
											</Link>
											<Link
												href="/examples"
												className="font-medium hover:text-primary transition-colors"
											>
												Examples
											</Link>
										</nav>
										<Link href="/auth/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
											Sign In
										</Link>
										<Link href="/auth/sign-up" className="text-sm font-medium hover:text-primary transition-colors">
											Sign Up
										</Link>
									</SignedOut>

									<ModeToggle />
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</header>
	);
}
