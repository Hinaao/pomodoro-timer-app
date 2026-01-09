import { useEffect } from "react";
import { useScheduleStore } from "@/store/scheduleStore";
import { getSessions } from "@/lib/localStorage";
import { format } from "date-fns";

export function useSchedule() {
  const { schedules, loadSchedules, updateCompletedPomodoros } =
    useScheduleStore();

  // 初回マウント時にスケジュール読み込み
  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // セッション履歴から完了ポモドーロ数を集計して更新
  const syncCompletedPomodoros = () => {
    const sessions = getSessions();

    schedules.forEach((schedule) => {
      schedule.tasks.forEach((task) => {
        // このタスクの完了セッションをカウント
        const completedCount = sessions.filter((session) => {
          // セッションの日付がスケジュール日付と一致するか
          const sessionDate = format(new Date(session.startedAt), "yyyy-MM-dd");
          if (sessionDate !== schedule.date) return false;

          // タスクIDが一致するか
          if (session.taskId !== task.linearIssueId) return false;

          // 中断されていないか
          if (session.interrupted) return false;

          // 完了しているか
          if (!session.completedAt) return false;

          // workモードのみカウント（breakは除外）
          if (session.mode !== "work") return false;

          return true;
        }).length;

        // 現在の値と異なる場合のみ更新
        if (completedCount !== task.completedPomodoros) {
          updateCompletedPomodoros(
            schedule.date,
            task.linearIssueId,
            completedCount
          );
        }
      });
    });
  };

  return {
    syncCompletedPomodoros,
  };
}
