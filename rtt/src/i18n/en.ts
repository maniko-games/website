export const en = {
  scan: {
    permissionTitle: 'Camera access',
    permissionBody: 'We use the camera only to read barcodes on products. No photos are taken.',
    permissionButton: 'Allow camera',
    permissionDenied: 'Camera access is turned off. Enable it in your phone settings.',
    openSettings: 'Open settings',
    hint: 'Point the camera at a barcode',
  },
  lookup: {
    searching: 'Looking it up…',
    networkError: 'Could not reach the product database. Check your internet connection.',
    retry: 'Try again',
    enterManually: 'Enter manually',
    cancel: 'Cancel',
  },
  confirm: {
    title: 'Is this it?',
    yes: 'Yes, this is it',
    no: 'No, enter manually',
    source: 'Product data: Open Food Facts',
  },
  form: {
    notFound: 'We do not know this barcode yet. Enter the details yourself.',
    name: 'Name',
    brand: 'Brand',
    quantity: 'Weight or volume',
    rating: 'Your rating',
    comment: 'Comment',
    commentPlaceholder: 'What did you like or dislike?',
    save: 'Save',
    nameRequired: 'Enter a name',
    ratingRequired: 'Pick a rating',
    cancel: 'Cancel',
  },
  item: {
    title: 'Your rating',
    noComment: 'No comment',
    edit: 'Edit',
    scanNext: 'Scan next',
  },
};

export type Strings = typeof en;
