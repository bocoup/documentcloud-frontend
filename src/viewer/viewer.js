import { Svue } from "svue";
import { getDocument, getMe } from "@/api/document";
import { getAnnotations } from "@/api/annotation";
import { getSections } from "@/api/section";
import { router } from "@/router/router";

function extractId(idSlug) {
  return parseInt(idSlug.split("-")[0]);
}

export const viewer = new Svue({
  data() {
    return {
      router,
      notes: null,
      sections: null,
      document: null,
      id: null,
      me: null,
      loadedMe: false,

      // Set to true if document fails to load
      show404: false
    };
  },
  watch: {
    "router.resolvedRoute"() {
      const route = router.resolvedRoute;
      if (route != null && route.name == "viewer" && route.props != null) {
        this.id = extractId(route.props.id);
        return initViewer(this.id);
      }
    }
  },
  computed: {
    orderedSections(sections) {
      if (sections == null) return null;
      return sections.sort((a, b) => a.page - b.page);
    },
    orderedSectionsAndNotes(orderedSections, orderedNotes) {
      if (orderedSections == null || orderedNotes == null) return null;
      let sectionIdx = 0;
      let noteIdx = 0;

      const results = [];

      while (
        sectionIdx < orderedSections.length ||
        noteIdx < orderedNotes.length
      ) {
        const currentSection = orderedSections[sectionIdx];
        const currentNote = orderedNotes[noteIdx];

        if (
          currentSection != null &&
          (currentNote == null || currentSection.page <= currentNote.page)
        ) {
          results.push({ type: "section", value: currentSection });
          sectionIdx++;
        } else {
          results.push({ type: "note", value: currentNote });
          noteIdx++;
        }
      }

      return results;
    },
    sectionsAndNotes(orderedSectionsAndNotes) {
      if (orderedSectionsAndNotes == null) return null;

      let currentSection = null;
      const results = [];

      for (let i = 0; i < orderedSectionsAndNotes.length; i++) {
        const chunk = orderedSectionsAndNotes[i];
        if (chunk.type == "section") {
          currentSection = {
            type: "section",
            section: chunk.value,
            children: []
          };
          results.push(currentSection);
        } else {
          if (currentSection == null) {
            results.push({
              type: "note",
              note: chunk.value
            });
          } else {
            currentSection.children.push({
              type: "note",
              note: chunk.value
            });
          }
        }
      }

      return results;
    },
    loaded(document, pageAspects, notes, sections, loadedMe) {
      return (
        document != null &&
        pageAspects != null &&
        notes != null &&
        sections != null &&
        loadedMe
      );
    },
    orderedNotes(notes) {
      if (notes == null) return null;
      notes.sort((note1, note2) => {
        if (note1.page != note2.page) {
          return note1.page - note2.page;
        }
        if (note1.y1 != note2.y1) {
          return note1.y1 - note2.y1;
        }
        if (note1.x1 != note2.x1) {
          return note1.x1 - note2.x1;
        }
        // Notes are same exact position
        return 0;
      });
      return notes;
    },
    notesByPage(orderedNotes) {
      if (orderedNotes == null) return {};
      const index = {};
      orderedNotes.forEach(note => {
        const existing = index.hasOwnProperty(note.page)
          ? index[note.page]
          : [];
        index[note.page] = [...existing, note];
      });
      return index;
    },
    pageAspects(document) {
      if (document == null) return null;

      return document.pageSizes;
    }
  }
});

export function updateNote(note) {
  viewer.notes = viewer.notes.map(oldNote => {
    if (oldNote.id == note.id) return note;
    return oldNote;
  });
}

export function addNote(note) {
  viewer.notes = [...viewer.notes, note];
}

export function removeNote(note) {
  viewer.notes = viewer.notes.filter(oldNote => oldNote.id != note.id);
}

function initViewer(id) {
  // Initialize the viewer.
  getDocument(id)
    .then(doc => (viewer.document = doc))
    .catch(() => {
      viewer.show404 = true;
    });
  getAnnotations(id).then(notes => (viewer.notes = notes));
  getSections(id).then(sections => {
    viewer.sections = sections;
  });
  getMe()
    .then(me => {
      viewer.me = me;
      viewer.loadedMe = true;
    })
    .catch(() => {
      viewer.me = null;
      viewer.loadedMe = true;
    });
}
