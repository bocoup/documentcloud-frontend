import { Svue } from "svue";
import { router, pushUrl, nav } from "@/router/router";
import {
  getOrganizations,
  getUsers,
  getMe,
  changeActiveOrg,
} from "@/api/orgAndUser";
import { projects, initProjects } from "./projects";
import { uniquify } from "@/util/array";
import { userUrl, allDocumentsUrl } from "@/search/search";
import { layout } from "@/manager/layout";
import { wrapLoad } from "@/util/wrapLoad";
import { pushToast } from "./toast";

let previousRouteName = null;

export const orgsAndUsers = new Svue({
  data() {
    return {
      me: null,
      allOrganizations: [],
      organizationUsers: [],
      projects,
      router,
    };
  },
  watch: {
    // Don't re-request across searches within the app
    "router.resolvedRoute"() {
      const route = router.resolvedRoute;
      if (route != null && route.name == "app") {
        // Initiate orgs and users in the app
        if (route.name != previousRouteName) initOrgsAndUsers();
      } else if (
        route != null &&
        (route.name == "home" || route.name == "default")
      ) {
        if (previousRouteName != "home" && previousRouteName != "default") {
          getSelfUser();
        }
      } else {
        this.me = null;
        this.allOrganizations = [];
        this.users = [];
      }
      previousRouteName = route == null ? null : route.name;
    },
  },
  computed: {
    allUsers(projects, organizationUsers) {
      return uniquify([...projects.projectUsers, ...organizationUsers]);
    },
    organizations(allOrganizations) {
      return allOrganizations.filter((org) => !org.individual);
    },
    orgsById(allOrganizations) {
      const results = {};
      for (let i = 0; i < allOrganizations.length; i++) {
        const organization = allOrganizations[i];
        results[organization.id] = organization;
      }
      return results;
    },
    loggedIn(me) {
      return me != null;
    },
  },
});

async function getSelfUser() {
  orgsAndUsers.me = await getMe();
  if (router.resolvedRoute.name == "app") {
    // Push self search route if no search params are set in app
    const routeProps = router.resolvedRoute.props;
    if (routeProps.q == null || routeProps.dq == null) {
      if (orgsAndUsers.me != null) {
        // Redirect to get self user route if no search params are set
        pushUrl(userUrl(orgsAndUsers.me));
      } else {
        // Redirect to all documents if not logged in
        pushUrl(allDocumentsUrl());
      }
    }

    // Populate projects
    if (orgsAndUsers.me != null) initProjects(orgsAndUsers.me);
  } else if (router.resolvedRoute.name == "default") {
    // On the default page, nav to app or home based on current user
    if (orgsAndUsers.me != null) {
      nav("app");
    } else {
      nav("home");
    }
  }
}

async function initOrgsAndUsers() {
  getSelfUser();

  // Get non-individual organizations
  orgsAndUsers.allOrganizations = await getOrganizations();

  const orgIds = orgsAndUsers.organizations.map((proj) => proj.id);
  orgsAndUsers.organizationUsers = await getUsers({ orgIds });
}

export async function changeActive(org) {
  if (orgsAndUsers.me == null) return;
  if (orgsAndUsers.me.organization.id == org.id) return;

  await wrapLoad(layout, async () => {
    await changeActiveOrg(org.id);

    orgsAndUsers.me.organization = org;
    orgsAndUsers.me = orgsAndUsers.me;
    pushToast("Successfully changed active organization");
  });
}
