// 仮hook: Settings
export function useSettings() {
  // ダミーデータ
  const newCardLimit = 5;

  return {
    newCardLimit,
    setNewCardLimit: (limit: number) => {},
    exportData: () => {},
    importData: (file: File) => {},
    resetData: () => {},
  };
}