import { page } from "$app/state";
import type { Component } from "svelte";
import HomeIcon from '@lucide/svelte/icons/house';
import UsersIcon from '@lucide/svelte/icons/users';
import RocketIcon from '@lucide/svelte/icons/rocket';
import CircleUserRound from '@lucide/svelte/icons/circle-user-round';
import { m } from '$lib/paraglide/messages.js';

export type Page = {
	title: string;
	url: string;
	icon: Component;
	isVisible?: boolean;
	isActive?: boolean;
};

const _pages = {
	'home': {
		title: m.home(),
		url: '/',
		icon: HomeIcon,
	},
	'gettingStarted': {
		title: m.getting_started(),
		url: '/getting-started',
		icon: RocketIcon,
	},
	'manageAccess': {
		title: m.manage_access(),
		url: '/manage-access',
		icon: UsersIcon,
	},
	'account': {
		title: m.account(),
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
