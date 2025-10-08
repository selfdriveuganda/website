import { Link } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Empty>
				<EmptyHeader>
					<EmptyTitle>404 - Page Not Found</EmptyTitle>
					<EmptyDescription>
						The page you&apos;re looking for doesn&apos;t exist. Try searching
						for what you need below.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<InputGroup className="sm:w-3/4">
						<InputGroupInput placeholder="Try searching for pages..." />
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<Kbd>/</Kbd>
						</InputGroupAddon>
					</InputGroup>
					<EmptyDescription>
						Need help?{" "}
						<Link className="text-primary underline" to="/contact">
							Contact support
						</Link>{" "}
						or{" "}
						<Link className="text-primary underline" to="/">
							return home
						</Link>
					</EmptyDescription>
				</EmptyContent>
			</Empty>
		</div>
	);
}
