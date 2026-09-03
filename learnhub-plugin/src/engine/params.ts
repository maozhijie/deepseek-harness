/**
 * 可调参数集中表（吸收自 Python params.py，唯一出处；调整只改这里）。
 */
export const DESIRED_RETENTION = 0.9     // FSRS 期望保留率
export const R_GATE = 0.85               // 前置解锁的可提取性门槛
export const S_MASTER = 30.0             // mastered 标记的稳定性阈值（天）
export const REVIEW_RATIO = 0.6          // 任务包中复习时间占比
export const MIN_PER_REVIEW = 3          // 单个复习任务估时（分钟）
export const MIN_PER_NEW = 12            // 新节点首学预算（分钟）
export const DAILY_CAPACITY = 20         // 日均处理能力（防过载基准，个）
export const OVERLOAD_FACTOR = 2         // 复习债 > 日均×该倍数 → 停推新课
export const SOFT_RESTART_GAP = 3        // 空窗 ≥ N 天进入软重启（天）
export const RECOVERY_CLEAR_RATIO = 0.7  // 恢复模式清偿率达该值后恢复新课
export const QUIZ_ITEMS_PER_CANDIDATE = 2 // 前置抽测每候选最多题数
export const SCAN_INIT_S = 7.0           // scan 粗估初始稳定性（天）
export const SCAN_INIT_D = 5.0           // scan 粗估初始难度
