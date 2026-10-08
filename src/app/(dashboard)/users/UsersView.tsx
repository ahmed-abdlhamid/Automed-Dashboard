"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/Providers";
import type { AdminUser } from "@/lib/users.server";
import {
  Badge,
  Card,
  PageHeader,
} from "@/components/ui";

export default function UsersView({
  users,
}: {
  users: AdminUser[];
}) {
  const { t } =
    useI18n();

  const [
    query,
    setQuery,
  ] = useState("");

  const filteredUsers =
    useMemo(() => {
      const value =
        query
          .trim()
          .toLowerCase();

      if (!value) {
        return users;
      }

      return users.filter(
        (user) =>
          user.email
            .toLowerCase()
            .includes(value) ||
          (
            user.fullName ||
            ""
          )
            .toLowerCase()
            .includes(value) ||
          user.memberships.some(
            (membership) =>
              membership.projectName
                .toLowerCase()
                .includes(value)
          )
      );
    }, [
      users,
      query,
    ]);

  return (
    <>
      <PageHeader
        title={t({
          ar: "المستخدمون والصلاحيات",
          en: "Users & Roles",
        })}
        subtitle={t({
          ar: "إدارة المستخدمين وربطهم بالمشاريع",
          en: "Manage users and their project access",
        })}
      />

      <Card>
        <div className="border-b border-line p-6">
          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            className="field max-w-xl"
            placeholder={t({
              ar: "ابحث بالاسم أو البريد أو المشروع",
              en: "Search name, email or project",
            })}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-start">
                <th className="px-6 py-4 text-start font-semibold text-mut">
                  {t({
                    ar: "المستخدم",
                    en: "User",
                  })}
                </th>

                <th className="px-6 py-4 text-start font-semibold text-mut">
                  {t({
                    ar: "المشاريع",
                    en: "Projects",
                  })}
                </th>

                <th className="px-6 py-4 text-start font-semibold text-mut">
                  {t({
                    ar: "الصلاحية",
                    en: "Role",
                  })}
                </th>

                <th className="px-6 py-4 text-start font-semibold text-mut">
                  {t({
                    ar: "تاريخ الإضافة",
                    en: "Created",
                  })}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(
                (user) => (
                  <tr
                    key={user.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">
                          {user.fullName ||
                            t({
                              ar: "مستخدم",
                              en: "User",
                            })}
                        </p>

                        <p
                          dir="ltr"
                          className="mt-1 text-xs text-mut"
                        >
                          {user.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {user.memberships.length ===
                      0 ? (
                        <span className="text-mut">
                          {t({
                            ar: "لا توجد مشاريع",
                            en: "No projects",
                          })}
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.memberships.map(
                            (
                              membership
                            ) => (
                              <span
                                key={`${user.id}-${membership.projectId}`}
                                className="rounded-full border border-line bg-card px-3 py-1 text-xs font-medium"
                              >
                                {
                                  membership.projectName
                                }
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.memberships.map(
                          (
                            membership
                          ) => (
                            <Badge
                              key={`${user.id}-${membership.projectId}-role`}
                              tone={
                                membership.role ===
                                "admin"
                                  ? "ok"
                                  : "warn"
                              }
                            >
                              {membership.role ===
                              "admin"
                                ? t({
                                    ar: "Admin",
                                    en: "Admin",
                                  })
                                : t({
                                    ar: "عميل",
                                    en: "Client",
                                  })}
                            </Badge>
                          )
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        dir="ltr"
                        className="text-xs text-mut"
                      >
                        {new Intl.DateTimeFormat(
                          "en-CA",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            timeZone:
                              "Africa/Cairo",
                          }
                        ).format(
                          new Date(
                            user.createdAt
                          )
                        )}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {filteredUsers.length ===
            0 && (
            <div className="p-8 text-center text-sm text-mut">
              {t({
                ar: "لا توجد نتائج",
                en: "No users found",
              })}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}