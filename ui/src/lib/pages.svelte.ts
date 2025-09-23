import { page } from "$app/state";
import type { Component } from "svelte";
import HomeIcon from '@lucide/svelte/icons/house';
import UsersIcon from '@lucide/svelte/icons/users';
import LinkIcon from '@lucide/svelte/icons/link';
import CircleUserRound from '@lucide/svelte/icons/circle-user-round';

export type Page = {
	title: string;
	url: string;
	icon: Component;
	visible?: boolean;
	isActive?: boolean;
};

const _pages = {
	'home': {
		title: 'Home',
		url: '/',
		icon: HomeIcon,
	},
	'gettingStarted': {
		title: 'Getting started',
		url: '/getting-started',
		icon: LinkIcon,
	},
	'liveTrack': {
		title: 'LiveTrack',
		url: '/livetrack',
		icon: LinkIcon,
	},
	'spectators': {
		title: 'Spectators',
		url: '#',
		icon: UsersIcon
	},
	'account': {
		title: 'Account',
		url: '/account',
		icon: CircleUserRound,
	}
} satisfies Record<string, Omit<Page, 'isActive'>>

export type PageName = keyof typeof _pages;

export function pages(): Record<PageName, Page> {
	return Object.fromEntries(
		Object.entries(_pages).map(([key, value]) => {
			return [
				key, {
					...value,
					isActive: value.url === '/' ? page.url.pathname === '/'
						: page.url.pathname.startsWith(value.url)
				}
			];
		})
	) as Record<PageName, Page>
}

export function currentPage(): Page | undefined {
	return Object.values(pages())
		.find((page) => page.isActive)
}
