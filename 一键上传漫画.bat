@echo off
:: 设置窗口支持中文显示
chcp 65001 > nul

echo ========================================
echo   漫画柜一键全自动同步 - 正在运行...
echo ========================================

:: 1. 自动删除漫画文件夹里的隐藏 .git 文件 (解决“文件夹传上去是空的”这个顽疾)
echo [1/5] 正在检查并修复漫画目录...
for /d %%i in (manga\*) do (
    if exist "%%i\.git" (
        rd /s /q "%%i\.git"
    )
)

:: 2. 调大 Git 的上传缓存到 500MB (防止 200MB 报错断开)
echo [2/5] 优化上传配置...
git config --local http.postBuffer 524288000

:: 3. 运行索引脚本 (必须要用 call 确保 node 跑完后继续执行)
echo [3/5] 更新索引数据 (data.json)...
call node scripts/build-list.js

:: 4. 抓取所有改动
echo [4/5] 正在准备上传文件...
git add --all

:: 5. 提交并强制推送 (解决所有冲突，以本地为准)
echo [5/5] 正在强制同步到 GitHub (请耐心等待)...
git commit -m "AutoUpdate_%date:~0,10%"
git push -f origin main

echo ========================================
echo   ✅ 同步成功！现在去手机端看新本子吧。
echo ========================================
pause