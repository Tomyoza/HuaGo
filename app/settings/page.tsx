// Settings ページ
'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ModalConfirm from '@/components/ModalConfirm';
import { useSettings } from '@/lib/hooks/useSettings';

export default function SettingsPage() {
  const { newCardLimit, setNewCardLimit, exportData, importData, resetData } = useSettings();

  const [selectedLimit, setSelectedLimit] = useState(newCardLimit);
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader title="設定" showBack backHref="/" />

      <div className="p-4 space-y-6">
        {/* 新規上限 */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">学習設定</h2>
          <div>
            <label className="block text-sm font-medium mb-2">
              新規学習上限（1日あたり）
            </label>
            <select
              value={selectedLimit}
              onChange={(e) => setSelectedLimit(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            >
              {[5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}枚
                </option>
              ))}
            </select>
            <button
              onClick={() => setNewCardLimit(selectedLimit)}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </section>

        {/* Export/Import */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">データ管理</h2>
          <div className="space-y-4">
            <button
              onClick={exportData}
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export (JSON)
            </button>
            <button
              onClick={() => {}}
              className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Import (JSON)
            </button>
          </div>
        </section>

        {/* データ初期化 */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-red-600">危険な操作</h2>
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600"
          >
            データ初期化
          </button>
        </section>
      </div>

      <ModalConfirm
        isOpen={showResetModal}
        title="データ初期化"
        message="全ての学習データを削除します。この操作は取り消せません。本当に実行しますか？"
        onConfirm={() => {
          resetData();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </main>
  );
}

