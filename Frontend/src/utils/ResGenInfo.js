const resourceGeneralInfo = [
	{
		name: "title",
		label: "Title",
		type: "text",
		required: true,
		placeholder: "Enter title...",
	},
	{
		name: "author",
		label: "Author Name",
		type: "text",
		required: true,
		placeholder: "Enter author name...",
	},
	{
		name: "description",
		label: "Description",
		type: "textarea",
		required: false,
		placeholder: "Describe...",
	},
	{
		name: "shortDescription",
		label: "Short Description",
		type: "textarea",
		required: true,
		placeholder: "Describe...",
	},
	{
		name: "coverImageURL",
		label: "Cover Image",
		type: "file",
		required: false,
		multiple: false,
	},
	{
		name: "resourceImageURLs",
		label: "Images",
		type: "file",
		required: false,
		multiple: true,
	},
	{
		name: "tags",
		label: "Tags",
		type: "text",
		required: true,
		placeholder: "Enter comma separated tags...",
	},
	{
		name: "freeShipping",
		label: " Free Shipping Available",
		required: true,
		type: "select",
		options: ["yes", "no"],
	},
	{
		name: "estimatedDays",
		label: "Estimated Days",
		type: "text",
		required: true,
	},
	{
		name: "returnPolicy",
		label: " Return Policy",
		required: true,
		type: "text",
	},
];

export default resourceGeneralInfo;
