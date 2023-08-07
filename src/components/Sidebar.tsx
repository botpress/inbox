import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function Sidebar() {
	return (
		<aside className="">
			<div>
				<h1>
					<EnvelopeIcon className="h-6 w-6" /> Inbox
				</h1>
			</div>
			<ul>
				<li>
					<Link to="/">Chats</Link>
					<Link to="/">Contacts</Link>
					<Link to="/">Bots</Link>
				</li>
			</ul>
			<ul>
				<li>
					<Link to="/">Settings</Link>
				</li>
			</ul>
		</aside>
	);
}
