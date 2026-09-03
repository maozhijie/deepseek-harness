/**
 * YAML 统一出口：全引擎唯一从 `yaml` 包取数的地方。
 *
 * dump 固定 allowUnicode / 不排序键 / 宽 120 列（与旧引擎 Python yaml.safe_dump
 * allow_unicode=True, sort_keys=False, width=120 的产出对齐，图文件 diff 友好）。
 */
import { parse, stringify } from 'yaml'

export const YAML = {
  parse: (text: string): unknown => parse(text),
  stringify: (value: unknown): string =>
    stringify(value, { aliasDuplicateObjects: false, lineWidth: 120 }),
}
