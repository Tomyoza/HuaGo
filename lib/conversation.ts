// 会話テンプレートドリル用のロジック

import { db } from './db';
import type { ConversationTemplate, ConversationNode } from './types';

/**
 * 利用可能なシーン（scene）を取得
 */
export async function getAvailableScenes(): Promise<string[]> {
  const templates = await db.conversationTemplates.toArray();
  const scenes = new Set<string>();
  
  for (const template of templates) {
    scenes.add(template.scene);
  }
  
  return Array.from(scenes).sort();
}

/**
 * シーンでテンプレートを取得
 */
export async function getTemplatesByScene(scene: string): Promise<ConversationTemplate[]> {
  return db.conversationTemplates
    .where('scene')
    .equals(scene)
    .toArray();
}

/**
 * テンプレートIDで取得
 */
export async function getTemplateById(id: string): Promise<ConversationTemplate | undefined> {
  return db.conversationTemplates.get(id);
}

/**
 * ノードIDで次のノードを取得（分岐を考慮）
 */
export function getNextNodes(
  template: ConversationTemplate,
  currentNodeId: string,
  userResponse?: string
): ConversationNode[] {
  const branches = template.branches.filter(b => b.from_node_id === currentNodeId);
  
  // 条件に一致する分岐を探す
  let targetBranches = branches;
  if (userResponse) {
    targetBranches = branches.filter(b => 
      !b.condition || b.user_response === userResponse || b.condition === userResponse
    );
  }
  
  // 分岐先のノードを取得
  const nextNodeIds = targetBranches.map(b => b.to_node_id);
  return template.nodes.filter(n => nextNodeIds.includes(n.id));
}

/**
 * 開始ノードを取得（通常は最初のノード）
 */
export function getStartNode(template: ConversationTemplate): ConversationNode | null {
  // 分岐のfrom_node_idに含まれていないノードが開始ノード
  const branchFromIds = new Set(template.branches.map(b => b.from_node_id));
  const startNode = template.nodes.find(n => !branchFromIds.has(n.id));
  
  return startNode || template.nodes[0] || null;
}

