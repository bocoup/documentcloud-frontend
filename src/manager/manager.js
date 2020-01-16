import { Svue } from "svue";

import { documents, removeDocuments, reprocessDocuments } from './documents';
import { layout } from './layout';

export const manager = new Svue({
  data() {
    return {
      documents,
      layout,
    }
  },
  computed: {
    hasDocuments(documents) {
      return documents.documents.length > 0;
    },
    allSelected(hasDocuments, documents, layout) {
      return hasDocuments && documents.documents.every(doc => layout.selectedMap[doc.id] != null);
    },
    someSelected(hasDocuments, layout, allSelected) {
      return hasDocuments && layout.hasSelection && !allSelected;
    },
    noneSelected(hasDocuments, layout) {
      return !hasDocuments || !layout.hasSelection;
    }
  }
})

export function selectAll() {
  const results = {};
  documents.documents.forEach(doc => {
    results[doc.id] = doc;
  });
  layout.selectedMap = results;
}

export function removeSelected() {
  removeDocuments(layout.selected);
}

export function renameSelected() {
  if (layout.numSelected == 0) return;
  layout.renameOpen = true;
}

export function changeAccessSelected() {
  if (layout.numSelected == 0) return;
  layout.accessEditDocuments = layout.selected.slice();
}

export function reprocessSelected() {
  reprocessDocuments(layout.selected);
}