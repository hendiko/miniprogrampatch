const { patchPage, patchComponent } = require("./miniprogrampatch");

// 全局增强
Page = patchPage(Page);
// Component = patchComponent(Component);

App();
