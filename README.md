# German-CY + Français — 家长远程监督版

这是 **GitHub Pages + Firebase Authentication + Cloud Firestore** 的可部署代码包。尚未绑定你的 Firebase 项目，因此默认关闭云端；关闭时两套练习器仍可继续本地默写。

## 目录和网址

把这个压缩包 **内部内容** 放在 `german-cy` 仓库根目录（不要额外套一层目录）：

```
german-cy/
├── index.html                  德语练习
├── config.js                   德语每日打卡配置
├── fr/
│   ├── index.html              法语练习（46个动词）
│   ├── config.js               法语每日打卡配置
│   └── data.js                 法语词库
├── shared/
│   ├── firebase-config.js      Firebase 项目配置（需要填写）
│   ├── sync.js                 孩子设备的同步程序
│   └── sync.css
├── parent/
│   ├── index.html              家长页面
│   └── dashboard.js
├── firestore.rules             Firebase Console 里部署的安全规则
└── README.md
```

网址：
- 德语：https://seay98.github.io/german-cy/
- 法语：https://seay98.github.io/german-cy/fr/
- 家长：https://seay98.github.io/german-cy/parent/

## 第一次启用云端：操作步骤

1. 进入 https://console.firebase.google.com/ ，创建一个 Firebase 项目（项目名自选）。打开 **Authentication > Sign-in method**，启用 **Email/Password**。根据实际的授权域设置，添加 `seay98.github.io` 到 **Authorized domains**（如需要）。
2. 在 Authentication 的 **Users** 页面手动创建两个不同用户：**孩子账号**（只用于孩子使用的手机）与 **家长账号**。不要将密码放进任何仓库文件。分别复制两个用户的 **UID**。
3. **Firestore Database** > Create database。创建之后进入 **Rules**，粘贴 `firestore.rules`，把 `PASTE_CHILD_UID` 和 `PASTE_PARENT_UID` 分别替换成两人的 **UID**，然后 **Publish**。不要使用 test mode 开放读写规则。
4. Firebase **Project settings > Your apps > Web app**，注册网页应用，复制 SDK 配置对象对应的四项到 `shared/firebase-config.js`：`apiKey`、`authDomain`、`projectId`、`appId`。将其中 `CHILD_AUTH_UID` 改为孩子 UID、`CLOUD_ENABLED` 改为 `true`。`CHILD_DOCUMENT_ID` 保持 `child1`（与安全规则一致）。
5. **先备份仓库现有文件**，再上传本包到根目录，尤其保持已有的 `index.html` 与两个配置文件的路径。GitHub Pages 更新后，在孩子原来的手机、原来的浏览器，打开德语 / 法语页面，使用孩子账户各登录一次。
6. **首次同步**：如果云端没有记录，会把当前本地进度上传；如果云端已有记录且本地也有记录，会出现两个明确按钮（保留本机 / 下载云端）。请核对后选择。**不要在做出选择前使用“清除学习记录”按钮。** 两个 App 需要分别首次登录 / 确认一次（登录账号会在同一浏览器持久化）。
7. 家长在自己的手机或电脑打开 `/parent/`，用**家长账号**登录，就能读取两种语言的云端记录。刷新按钮可以手动拉取最新数据。

## 现有学习记录如何保留？

**不会改变原有 localStorage 键名**：

- 德语总计与错题：`unregelmaessige_verben_320_328_v2`
- 德语打卡：`unregelmaessige_verben_stempelkarte_v4_richtig50`
- 法语：`french_cy_progress_v1`

因此，同一网站来源、同一浏览器、同一浏览器配置内原记录可以直接迁移到云端。***注意：*** 如果孩子此前用 `file://` 本地 HTML 或其他浏览器进行练习，GitHub Pages 无法读取那一份独立存储，需在旧环境先使用旧版导出，再在同一网站导入，或另行处理。

初次同步有冲突时，程序**不会自动合并历史统计**（避免不同设备的累计计数加总造成重复）；需要你选择“以本机为准”或“以云端为准”。建议在孩子常用的一台设备上长期练习，避免多个设备离线同时编辑导致最后写入覆盖更早的数据。云端不会替代定期备份。

## 家长可以看到什么？

- 德语 / 法语各自的每日正确题数和最近七天打卡；
- 历史总题数、正确题数及整题正确率；
- 目前仍在错题列表的题目 / 动词；
- **启用此同步版后** 的每日答题数、全部正确组数及每题累计出错次数（旧版仅保存汇总，因此无法重建过去每一次错误和每天尝试题数）；
- 最近一次成功写入云端的时间。

法语以一整组变位“全对”计一道正确题；德语按整题全对计数。旧的历史星星保持原有数据含义，不依据新设置追溯改写。`config.js` 中的 `DAILY_GOAL` 保持为50，可按需求更改。

## 隐私、安全和限制

- Firebase **Web API key 不是账户密码**；身份验证和 Firestore Security Rules 是访问控制。**绝不可将密码、服务账号私钥或 Admin SDK 凭据上传 GitHub**。
- 家长 UID 只能读取，孩子 UID 才能写入；未登录用户和其他 UID 都不能读取孩子的数据。规则需先发布再启用云端。Firebase 官方指南：https://firebase.google.com/docs/firestore/security/get-started
- 使用孩子专用的 Firebase 登录账号；不要使用家长密码登录孩子设备。孩子登录后云端凭据会在其浏览器本地保持，保护好设备及账号。
- 这是基于**一个孩子、一台主要练习设备、一个家长账号**的初版。不是防篡改的考试或考勤系统，孩子设备上的本地数据仍可由设备所有者更改。
- 浏览器关闭、断网或同步故障时，作答先写本地存储；网络恢复后可用“Jetzt synchronisieren / Synchroniser maintenant”处理未同步数据（首次冲突仍需选择）。家长面板看到的是**最后一次成功上云**的记录，而非必然实时。
- 同步版首次运行需联网加载 Firebase JS SDK。当前未设置 `CLOUD_ENABLED=true` 时不会联网写入任何 Firebase 数据。

## 验收检查

1. 备份旧版孩子的本地数据，在更新版第一次打开时，统计及星星仍正常显示。
2. 孩子登录并确认同步，家长打开 `/parent/`，两种语言都能看到最新云端记录。
3. 德语答对1题，家长刷新看到正确数变化；答错1题，错题列表出现对应动词。
4. 法语整组全对计1题；只对5/6不计正确题但计已批改；家长可看到对应统计。
5. 家长账号尝试修改 Firestore 文档，应被规则拒绝。任何第三方账号读取文档也应被拒绝。

此安装包还没有连接真实 Firebase 项目、没有替你创建用户或部署 Firestore Rules，也没有在线验收登录与网络同步。请在配置后进行手机端和家长端实际测试。
