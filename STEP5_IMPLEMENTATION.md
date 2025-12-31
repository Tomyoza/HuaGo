# Step5 実装完了レポート

## 実装内容

### ConversationTemplateのJSONスキーマ拡張

型定義を拡張して、会話ドリルに必要な情報を追加：

- **ConversationNode**:
  - `prompt_text_trad`: プロンプト用の繁體（表示用）
  - `prompt_pinyin`: プロンプト用の拼音
  - `prompt_ja`: プロンプト用の日本語説明（短く）
  - `followup_suggestions`: 追加の一言

- **ConversationBranch**:
  - `user_response`: ユーザーの返答選択肢

- **ConversationTemplate**:
  - `key_phrases`: キーフレーズ（SRSカード生成用）

### seed.json

会話テンプレート1本を追加：
- シーン: 「レストランでの注文」
- ノード: 3つ（店員→ユーザー→店員）
- 分岐: 2つ
- キーフレーズ: 2つ（「歡迎光臨，幾位？」「兩位」）

### lib/conversation.ts

会話テンプレートドリル用のロジック：

1. **`getAvailableScenes()`**: 利用可能なシーンを取得
2. **`getTemplatesByScene(scene)`**: シーンでテンプレートを取得
3. **`getTemplateById(id)`**: テンプレートIDで取得
4. **`getNextNodes(template, currentNodeId, userResponse?)`**: ノードIDで次のノードを取得（分岐を考慮）
5. **`getStartNode(template)`**: 開始ノードを取得

### lib/conversationCardGenerator.ts

SRSカード自動生成/登録ロジック：

- **`generateCardsFromTemplate(template, defaultGrade)`**
  - 会話テンプレートのキーフレーズからSRSカードを生成
  - カードを作成（重複チェック）
  - UserCardStateを作成（SRSに投入）

### app/conversation/page.tsx

会話テンプレートドリルページを実装。

#### フロー

1. **シーン選択**
   - 利用可能なシーンを選択

2. **テンプレート選択**
   - 選択したシーンのテンプレートを選択

3. **会話ドリル**
   - ノード表示：
     - prompt_text_trad（繁體）
     - prompt_pinyin（あれば）
     - prompt_ja（日本語説明）
     - followup_suggestions（追加の一言）
     - SpeakButtonで prompt_text_trad を読み上げ
   - 返答選択：
     - 分岐に応じて次のノードを選択
   - 会話履歴表示

4. **完了**
   - キーフレーズからSRSカードを自動生成
   - 完了メッセージ表示

## 受け入れ条件の確認

✅ **分岐が動く**
- `getNextNodes()`で分岐を処理
- ユーザーの返答選択に応じて次のノードへ遷移

✅ **完了後にSRSカードが追加される**
- `generateCardsFromTemplate()`でキーフレーズからカードを生成
- UserCardStateを作成してSRSに投入

✅ **SpeakButtonで読める**
- 各ノードで prompt_text_trad を読み上げ可能

✅ **Todayの会話導線から起動できる**
- Todayページに「会話ドリル」リンクが既に存在
- `/conversation` に遷移

## 実装のポイント

1. **分岐ロジック**
   - `getNextNodes()`で分岐を処理
   - `user_response`に基づいて次のノードを決定

2. **SRSカード自動生成**
   - キーフレーズからカードを生成
   - 重複チェック（同じhanzi_tradが既に存在する場合はスキップ）
   - デフォルトでEASY評価でSRSに投入

3. **会話履歴表示**
   - 会話の流れを視覚的に表示
   - ユーザー/相手を区別

4. **音声機能**
   - 各ノードで prompt_text_trad を読み上げ可能

## 実行手順

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて：
1. Todayページで「会話ドリル」をクリック
2. シーンを選択
3. テンプレートを選択
4. 会話ドリルを開始（返答を選択して分岐）
5. 完了後、キーフレーズがSRSカードとして登録される

