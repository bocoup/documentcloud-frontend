export const metaDialogs = [
  {
    menuTitle: "Title",
    fieldAccessor: (x) => x.title,
    fieldName: 'name',
    apiField: 'title',
    headerText: (docs) => `Rename ${docs}`,
    explainerText: (docs) => `Enter a name below for the ${docs}`,
    buttonText: 'Rename',
    fieldValid: (value, initial) =>
      value != initial && value.trim().length > 0,
    fieldInvalidText: (value, initial) =>
      value == initial
        ? `The document already has this name`
        : value.trim().length == 0
          ? `Enter a valid name`
          : "",
    disabled: (numSelected) => numSelected != 1
  },
  {
    menuTitle: "Source",
    fieldAccessor: (x) => x.source,
    fieldName: 'source',
    apiField: 'source',
    headerText: (docs) => `Edit source for ${docs}`,
    explainerText: (docs) => `Enter a source below for the ${docs}`,
    buttonText: 'Edit',
  },
  {
    menuTitle: "Description",
    fieldAccessor: (x) => x.description,
    fieldName: 'description',
    apiField: 'description',
    headerText: (docs) => `Edit description for ${docs}`,
    explainerText: (docs) => `Enter the description below for the ${docs}`,
    isTextArea: true,
    buttonText: 'Edit',
  },
  {
    menuTitle: "Related Article URL",
    fieldAccessor: (x) => x.relatedArticleUrl,
    fieldName: 'related article URL',
    apiField: 'related_article',
    headerText: (docs) => `Edit the related article URL for ${docs}`,
    explainerText: (docs) => `Enter the related article URL below for the ${docs}`,
    buttonText: 'Edit',
  },
  {
    menuTitle: "Published URL",
    fieldAccessor: (x) => x.publishedUrl,
    fieldName: 'published URL',
    apiField: 'published_url',
    headerText: (docs) => `Edit the published URL for ${docs}`,
    explainerText: (docs) => `Enter the published URL below for the ${docs}`,
    buttonText: 'Edit',
  },
];
