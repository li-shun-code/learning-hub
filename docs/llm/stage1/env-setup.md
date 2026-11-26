# 1. 环境搭建与虚拟环境

学 Python 第一步不是写代码，而是把环境装好。一个干净、可复现的环境能帮你避开后面 80% 的「明明照着教程做却跑不起来」问题。

## 一、安装 Python

1. 访问 [python.org/downloads](https://www.python.org/downloads/)，下载当前稳定版（建议 3.10 及以上）。
2. 安装时**务必勾选「Add Python to PATH」**（Windows），否则命令行找不到 `python`。
3. 验证安装：

```bash
python --version
# 或 macOS / Linux：
python3 --version
```

能输出版本号就成功了。

::: tip 版本怎么选
通用开发选 3.10+ 即可。有些老项目依赖旧版本，用虚拟环境或 Conda 隔离即可，不用卸载重装系统 Python。
:::

## 二、选择编辑器

- **新手**：VS Code 或 Cursor，装 Python 扩展，能语法高亮、一键运行就够了。
- **进阶**：多文件项目多了再考虑 PyCharm。

先别纠结工具，能写代码、能跑起来最重要。

## 三、虚拟环境：必须养成的习惯

真实项目会把第三方库装在**虚拟环境**里，而不是全局。原因很简单：A 项目要 `fastapi 0.100`，B 项目要 `fastapi 0.115`，装全局会打架。虚拟环境让每个项目依赖互相隔离。

### 用 venv（Python 自带）

```bash
# 进入项目目录
cd E:\code\project\my-app

# 创建虚拟环境（目录名通常叫 .venv 或 venv）
python -m venv .venv

# 激活
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Windows CMD:
.venv\Scripts\activate.bat
# macOS / Linux:
source .venv/bin/activate
```

激活后命令行前面会出现 `(.venv)` 前缀。此时安装的所有包都只在这个环境里。

### 用 uv（更快的选择）

[uv](https://docs.astral.sh/uv/) 是近年很流行的高性能 Python 包管理器，创建环境和装依赖速度极快：

```bash
uv venv          # 创建虚拟环境
uv pip install fastapi   # 装包
```

新手先用 `venv` 理解原理，熟练后换 `uv` 提速。

## 四、包管理基础

```bash
# 安装包
pip install requests

# 导出依赖清单（交付项目时用）
pip freeze > requirements.txt

# 从清单恢复环境
pip install -r requirements.txt
```

::: warning 常见坑
- 装包前先激活虚拟环境，否则装到全局去了。
- Windows 上如果 PowerShell 提示执行策略禁止激活脚本，运行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 后再试。
:::

## 五、跑通第一个程序

在项目里新建 `hello.py`：

```python
# hello.py
def main():
    name = input("你的名字：")
    print(f"你好，{name}！欢迎进入大模型应用开发的世界。")

if __name__ == "__main__":
    main()
```

运行：

```bash
python hello.py
```

看到问候语输出，环境就算准备好了。

## 六、这一节的验收标准

- [ ] `python --version` 正常输出
- [ ] 会创建并激活虚拟环境，知道激活后命令行有什么变化
- [ ] 会用 pip 装包、导出和恢复 `requirements.txt`
- [ ] 能独立跑通 `hello.py`

## 下一步

环境就绪，进入 [Python 核心语法](/llm/stage1/python-basics)。
