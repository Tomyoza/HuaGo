// 設定ページ（Export/Import含む）
'use client';

import { useState, useRef, useEffect } from 'react';
import { exportToFile, importFromFile } from '@/lib/importExport';
import { getNewCardLimit, setNewCardLimit } from '@/lib/learn';
import Link from 'next/link';

export default function SettingsPage() {
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCardLimit, setNewCardLimitState] = useState(5);
  const [isLoadingLimit, setIsLoadingLimit] = useState(true);

  useEffect(() => {
    loadNewCardLimit();
  }, []);

  const loadNewCardLimit = async () => {
    try {
      const limit = await getNewCardLimit();
      setNewCardLimitState(limit);
    } catch (error) {
      console.error('Failed to load new card limit:', error);
    } finally {
      setIsLoadingLimit(false);
    }
  };

  const handleSetNewCardLimit = async (limit: number) => {
    try {
      await setNewCardLimit(limit);
      setNewCardLimitState(limit);
      alert('新規上限を更新しました');
    } catch (error) {
      console.error('Failed to set new card limit:', error);
      alert('新規上限の更新に失敗しました');
    }
  };

  const handleExport = async () => {
    try {
      await exportToFile();
      alert('データをエクスポートしました');
    } catch (error) {
      console.error('Export error:', error);
      alert('エクスポートに失敗しました');
    }
  };

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }

    setImportStatus('loading');
    try {
      await importFromFile(file);
      setImportStatus('success');
      alert('データをインポートしました。ページをリロードしてください。');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('error');
      alert('インポートに失敗しました');
    }
  };

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">学習設定</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                新規学習上限（1日あたり）
              </label>
              {isLoadingLimit ? (
                <p className="text-gray-600">読み込み中...</p>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCardLimit}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 1 && value <= 10) {
                        setNewCardLimitState(value);
                      }
                    }}
                    className="w-20 px-3 py-2 border rounded"
                  />
                  <span className="text-gray-600">枚（1〜10）</span>
                  <button
                    onClick={() => handleSetNewCardLimit(newCardLimit)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    保存
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-600 mt-2">
                デフォルト: 5枚、最大: 10枚
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">データ管理</h2>
          <div className="space-y-4">
            <div>
              <button
                onClick={handleExport}
                className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Export (JSON)
              </button>
              <p className="text-sm text-gray-600 mt-2">
                全データをJSONファイルとしてダウンロードします
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importStatus === 'loading'}
                className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {importStatus === 'loading' ? 'インポート中...' : 'Import (JSON)'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                JSONファイルを選択してデータを復元します（上書き）
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

