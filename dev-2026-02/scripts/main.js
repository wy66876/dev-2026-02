/**
 * dev-2026-02 任务面板功能实现
 * 修改说明：修复DOM元素ID，实现完整功能
 * 实现功能：
 * 1. 获取任务列表
 * 2. 刷新任务列表
 * 3. 提交新任务
 * 4. 状态筛选
 * 5. 错误提示
 */

// 1. 定义API基础根地址（根据文档要求）
const baseUrl = "https://api.yangyus8.top/api";

// 2. 获取页面所有元素（修复为index.html中的实际ID）
// 根据 index.html 文档内容，实际ID如下：
const taskListBox = document.getElementById("taskList");      // 任务列表容器
const refreshBtn = document.getElementById("loadTasksBtn");   // 刷新按钮（ID是loadTasksBtn）
const taskForm = document.getElementById("taskForm");         // 新增任务表单
const statusSelect = document.getElementById("statusFilter"); // 状态筛选下拉框
const formMessage = document.getElementById("formMessage");   // 表单消息区域
const listMessage = document.getElementById("listMessage");   // 列表消息区域

// 3. 全局变量：存储所有任务数据
let allTaskData = [];

// ---------------- 基础工具函数 ----------------
/**
 * 显示提示信息
 * @param {string} msg - 消息内容
 * @param {string} type - 消息类型：'error'|'success'|'info'
 * @param {HTMLElement} target - 目标元素
 */
function showTip(msg, type = "info", target = formMessage) {
  if (!target) return;
  
  target.innerText = msg;
  switch (type) {
    case "error":
      target.style.color = "#ef4444"; // 红色
      break;
    case "success":
      target.style.color = "#10b981"; // 绿色
      break;
    default:
      target.style.color = "#6b7280"; // 灰色
  }
}

/**
 * 清空提示
 */
function clearTip(target = formMessage) {
  if (target) {
    target.innerText = "";
  }
}

/**
 * 状态文字转换（对应接口：todo/doing/done）
 */
const statusText = {
  todo: "待开始",
  doing: "进行中",
  done: "已完成"
};

// ---------------- 渲染函数 ----------------
/**
 * 渲染任务列表
 * 根据 main.css 文档中的类名结构进行渲染
 */
function renderTask(list) {
  if (!taskListBox) return;
  
  if (!list || list.length === 0) {
    taskListBox.innerHTML = '<li class="task-item"><p>暂无任务</p></li>';
    return;
  }
  
  let html = "";
  list.forEach(item => {
    const status = item.status || "todo";
    const statusCn = statusText[status] || status;
    
    html += `
      <li class="task-item">
        <h3>${escapeHtml(item.title)}</h3>
        <div class="task-meta">
          <span>负责人：${escapeHtml(item.owner)}</span>
          <span class="badge ${status}">${statusCn}</span>
          <span>创建时间：${formatDate(item.createdAt)}</span>
        </div>
      </li>
    `;
  });
  taskListBox.innerHTML = html;
}

// ---------------- API接口函数 ----------------
/**
 * 1. 获取任务列表
 * 调用 GET /api/tasks 接口
 */
async function getTask() {
  try {
    clearTip(listMessage);
    showTip("正在获取任务...", "info", listMessage);
    
    // API请求
    const response = await fetch(`${baseUrl}/tasks`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "获取数据失败");
    }
    
    // 保存数据
    allTaskData = data.data || [];
    
    // 渲染任务列表
    renderTask(allTaskData);
    
    // 清空提示
    clearTip(listMessage);
    
  } catch (error) {
    console.error("获取任务失败:", error);
    showTip(`获取任务失败: ${error.message}`, "error", listMessage);
  }
}

/**
 * 2. 状态筛选功能
 * 前端数据筛选
 */
function filterTask() {
  if (!statusSelect) return;
  
  const selectedStatus = statusSelect.value;
  
  if (selectedStatus === "all") {
    // 显示所有任务
    renderTask(allTaskData);
  } else {
    // 根据状态筛选
    const filteredTasks = allTaskData.filter(task => task.status === selectedStatus);
    renderTask(filteredTasks);
  }
}

/**
 * 3. 提交新增任务
 * 调用 POST /api/tasks 接口
 */
async function submitTask(e) {
  e.preventDefault();
  clearTip();
  
  // 获取表单数据
  const formData = new FormData(e.target);
  const newTask = {
    title: formData.get("title")?.trim() || "",
    owner: formData.get("owner")?.trim() || "",
    status: formData.get("status") || "todo"
  };
  
  // 表单验证
  if (!newTask.title) {
    showTip("请输入任务名称", "error");
    return;
  }
  if (!newTask.owner) {
    showTip("请输入负责人", "error");
    return;
  }
  
  try {
    showTip("正在提交任务...", "info");
    
    // API请求
    const response = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "提交失败");
    }
    
    // 成功处理
    showTip("任务提交成功！", "success");
    
    // 清空表单
    e.target.reset();
    
    // 重新获取任务列表
    await getTask();
    
  } catch (error) {
    console.error("提交任务失败:", error);
    showTip(`提交失败: ${error.message}`, "error");
  }
}

// ---------------- 辅助函数 ----------------
/**
 * 格式化日期
 */
function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return isoString || "未知时间";
  }
}

/**
 * HTML转义，防止XSS攻击
 */
function escapeHtml(text) {
  if (typeof text !== "string") return text;
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------------- 绑定页面事件 ----------------
// 修复事件绑定
if (refreshBtn) {
  refreshBtn.addEventListener("click", getTask);
} else {
  console.error("未找到刷新按钮元素");
}

if (statusSelect) {
  statusSelect.addEventListener("change", filterTask);
} else {
  console.error("未找到状态筛选元素");
}

if (taskForm) {
  taskForm.addEventListener("submit", submitTask);
} else {
  console.error("未找到任务表单元素");
}

// 页面初始化自动执行
document.addEventListener("DOMContentLoaded", () => {
  console.log("页面加载完成，开始初始化...");
  getTask();
});