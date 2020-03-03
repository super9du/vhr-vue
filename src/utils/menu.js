import {getRequest} from "./api";

const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(route => {
        let {
            path,
            name,
            meta,
            iconcls,
            children,
            component
        } = route;
        if (children && children instanceof Array) {
            children = formatRoutes(children)
        }
        let fmtRoute = {
            path: path,
            name: name,
            meta: meta,
            iconcls: iconcls,
            children: children,
            component: resolve => {
                if (component === 'Home') {
                    require(['../views/Home.vue'], resolve);
                } else if (component.startsWith('Emp')) {
                    require([`../views/emp/${component}.vue`], resolve);
                } else if (component.startsWith('Per')) {
                    require([`../views/per/${component}.vue`], resolve);
                } else if (component.startsWith('Sal')) {
                    require([`../views/sal/${component}.vue`], resolve);
                } else if (component.startsWith('Sta')) {
                    require([`../views/sta/${component}.vue`], resolve);
                } else if (component.startsWith('Sys')) {
                    require([`../views/sys/${component}.vue`], resolve);
                }
            }
        };
        fmtRoutes.push(fmtRoute);
    });
    return fmtRoutes;
};

export const initMenu = (store, router) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest('/system/config/menu').then(resp => {
        if (resp) {
            let fmtRoutes = formatRoutes(resp);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);
            store.dispatch('connect');
        }
    });
};
