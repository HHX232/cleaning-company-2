import { prisma } from "@/lib/prisma";
import AdminForm from "@/components/admin/AdminForm";
import { createReview, deleteReview, updateReview } from "./actions";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Отзывы</h1>
      <p className="mb-6 text-sm text-muted">
        Отзывы в блоке «Отзывы» на главной. «Звёзды» — оценка 1–5, «Услуга» — подпись под отзывом, «Порядок» — число
        для сортировки.
      </p>

      <div className="mb-2 hidden gap-2 px-4 text-[11px] font-bold text-muted uppercase sm:grid sm:grid-cols-[70px_2fr_1.4fr_70px_auto]">
        <span>Оценка</span>
        <span>Текст отзыва</span>
        <span>Услуга</span>
        <span>Порядок</span>
        <span></span>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        {reviews.length === 0 && <p className="text-sm text-muted">Пока нет отзывов.</p>}
        {reviews.map((review) => (
          <AdminForm
            key={review.id}
            action={updateReview.bind(null, review.id)}
            className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[70px_2fr_1.4fr_70px_auto]"
          >
            <input
              type="number"
              name="stars"
              title="Оценка 1–5" min={1}
              max={5}
              defaultValue={review.stars}
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="text"
              name="text"
              defaultValue={review.text}
              required
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="text"
              name="service"
              defaultValue={review.service}
              required
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="number"
              name="order"
              title="Порядок сортировки" defaultValue={review.order}
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                Сохранить
              </button>
              <button
                type="submit"
                formAction={deleteReview.bind(null, review.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-bg"
              >
                Удалить
              </button>
            </div>
          </AdminForm>
        ))}
      </div>

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый отзыв</summary>
        <AdminForm action={createReview} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[70px_2fr_1.4fr_70px_auto]">
          <input
            type="number"
            name="stars"
            title="Оценка 1–5" min={1}
            max={5}
            defaultValue={5}
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <input
            type="text"
            name="text"
            placeholder="Текст отзыва"
            required
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <input
            type="text"
            name="service"
            placeholder="Услуга"
            required
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <input
            type="number"
            name="order"
            title="Порядок сортировки" placeholder="0"
            defaultValue={0}
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
            Создать
          </button>
        </AdminForm>
      </details>
    </div>
  );
}
