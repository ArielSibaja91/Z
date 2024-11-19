export const formatPostDate = (createdAt: Date): string => {
	const currentDate: Date = new Date();
	const createdAtDate: Date = new Date(createdAt);

	const timeDifferenceInSeconds: number = Math.floor((currentDate.getTime() - createdAtDate.getTime()) / 1000);
	const timeDifferenceInMinutes: number = Math.floor(timeDifferenceInSeconds / 60);
	const timeDifferenceInHours: number = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays: number = Math.floor(timeDifferenceInHours / 24);

	if (timeDifferenceInDays > 1) {
		return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	} else if (timeDifferenceInDays === 1) {
		return "1d";
	} else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours}h`;
	} else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes}m`;
	} else {
		return "Just now";
	}
};

export const formatMemberSinceDate = (createdAt: Date): string => {
	const date: Date = new Date(createdAt);
	const months: string[] = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const month: string = months[date.getMonth()];
	const year: number = date.getFullYear();
	return `Joined ${month} ${year}`;
};