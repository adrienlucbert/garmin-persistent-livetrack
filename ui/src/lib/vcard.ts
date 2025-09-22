import vCardsJS from 'vcards-js';

type FullAddress = {
	label?: string;
	street?: string;
	city?: string;
	stateProvince?: string;
	postalCode?: string;
	countryRegion?: string;
};

type VCardDetails = {
	firstName: string;
	middleName?: string;
	lastName?: string;
	uid?: string;
	organization?: string;
	photo?: string;
	workPhone?: string;
	birthday?: Date;
	title?: string;
	url?: string;
	workUrl?: string;
	note?: string;
	version?: string;
	nickname?: string;
	namePrefix?: string;
	nameSuffix?: string;
	gender?: string;
	anniversary?: Date;
	role?: string;
	homePhone?: string;
	cellPhone?: string;
	pagerPhone?: string;
	homeFax?: string;
	workFax?: string;
	email?: string;
	workEmail?: string;
	logo?: string;
	source?: string;
	homeAddress?: FullAddress;
	workAddress?: FullAddress;
	socialUrls?: { string: string };
}

export function generateVCard(details: VCardDetails): string {
	const vcard = vCardsJS();
	for (let attr in details) {
		switch (attr) {
			case 'photo':
			case 'logo':
				vcard[attr].attachFromUrl(details[attr]);
				break;
			default:
				vcard[attr] = details[attr];
				break;
		}
	}
	return vcard.getFormattedString();
}
