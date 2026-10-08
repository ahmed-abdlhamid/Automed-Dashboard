"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/Providers";
import type { AdminUser } from "@/lib/users.server";
import {
  Badge,
  Card,
  Icon,
  PageHeader,
} from "@/components/ui";

export default function UsersView({
  users,
}: {
  users: AdminUser[];
}) {
  const { t } = useI18n();

  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(value) ||
        (user.fullName || "")
          .toLowerCase()
          .includes(value) ||
        user.memberships.some((membership) =>
          membership.projectName
            .toLowerCase()
            .includes(value)
        )
    );
  }, [users, query]);

  const adminCount = users.filter((user) =>
    user.memberships.some(
      (membership) => membership.role === "admin"
    )
  ).length;

  const clientCount = users.filter((user) =>
    user.memberships.some(
      (membership) => membership.role === "client"
    )
  ).length;

  return (
    <div className="users-page">
      <PageHeader
        title={t({
          ar: "المستخدمون والصلاحيات",
          en: "Users & Roles",
        })}
        subtitle={t({
          ar: "إدارة المستخدمين ومستوى وصولهم إلى المشاريع",
          en: "Manage users and their access to projects",
        })}
      />

      <section className="users-summary">
        <div className="users-summary-card users-summary-main">
          <div className="users-summary-icon">
            <Icon name="users" size={20} />
          </div>

          <div>
            <span>
              {t({
                ar: "إجمالي المستخدمين",
                en: "Total users",
              })}
            </span>

            <strong>{users.length}</strong>

            <small>
              {t({
                ar: "المستخدمون المسجلون في النظام",
                en: "Registered dashboard users",
              })}
            </small>
          </div>
        </div>

        <div className="users-summary-card">
          <span>
            {t({
              ar: "المشرفون",
              en: "Admins",
            })}
          </span>

          <strong>{adminCount}</strong>

          <small>
            {t({
              ar: "صلاحيات إدارية",
              en: "Administrative access",
            })}
          </small>
        </div>

        <div className="users-summary-card">
          <span>
            {t({
              ar: "العملاء",
              en: "Clients",
            })}
          </span>

          <strong>{clientCount}</strong>

          <small>
            {t({
              ar: "وصول للمشاريع",
              en: "Project access",
            })}
          </small>
        </div>
      </section>

      <Card
        className="users-table-card"
        title={t({
          ar: "قائمة المستخدمين",
          en: "User directory",
        })}
        subtitle={t({
          ar: "المستخدمون وصلاحياتهم الحالية",
          en: "Users and their current access",
        })}
        action={
          <span className="users-count-badge">
            {filteredUsers.length}{" "}
            {t({
              ar: "مستخدم",
              en: "users",
            })}
          </span>
        }
      >
        <div className="users-toolbar">
          <div className="users-search">
            <Icon name="search" size={16} />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder={t({
                ar: "ابحث بالاسم أو البريد أو المشروع",
                en: "Search name, email or project",
              })}
            />

            {query && (
              <button
                type="button"
                className="users-search-clear"
                onClick={() => setQuery("")}
                aria-label={t({
                  ar: "مسح البحث",
                  en: "Clear search",
                })}
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  {t({
                    ar: "المستخدم",
                    en: "User",
                  })}
                </th>

                <th>
                  {t({
                    ar: "المشاريع",
                    en: "Projects",
                  })}
                </th>

                <th>
                  {t({
                    ar: "الصلاحية",
                    en: "Role",
                  })}
                </th>

                <th>
                  {t({
                    ar: "تاريخ الإضافة",
                    en: "Created",
                  })}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="users-user-cell">
                      <div className="users-avatar">
                        {(user.fullName ||
                          user.email ||
                          "U")
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="users-user-info">
                        <strong>
                          {user.fullName ||
                            t({
                              ar: "مستخدم",
                              en: "User",
                            })}
                        </strong>

                        <span dir="ltr">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    {user.memberships.length === 0 ? (
                      <span className="users-muted">
                        {t({
                          ar: "لا توجد مشاريع",
                          en: "No projects",
                        })}
                      </span>
                    ) : (
                      <div className="users-projects">
                        {user.memberships.map(
                          (membership) => (
                            <span
                              key={`${user.id}-${membership.projectId}`}
                              className="users-project-chip"
                            >
                              {membership.projectName}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </td>

                  <td>
                    <div className="users-roles">
                      {user.memberships.map(
                        (membership) => (
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
                              ? "Admin"
                              : t({
                                  ar: "عميل",
                                  en: "Client",
                                })}
                          </Badge>
                        )
                      )}
                    </div>
                  </td>

                  <td>
                    <span
                      dir="ltr"
                      className="users-date"
                    >
                      {new Intl.DateTimeFormat(
                        "en-CA",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          timeZone: "Africa/Cairo",
                        }
                      ).format(
                        new Date(user.createdAt)
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="users-empty">
              <div className="users-empty-icon">
                <Icon name="users" size={20} />
              </div>

              <strong>
                {t({
                  ar: "لا توجد نتائج",
                  en: "No users found",
                })}
              </strong>

              <span>
                {t({
                  ar: "جرّب البحث باستخدام اسم أو بريد إلكتروني مختلف.",
                  en: "Try searching with a different name or email.",
                })}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}