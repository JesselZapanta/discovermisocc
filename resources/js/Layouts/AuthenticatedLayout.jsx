import React, { useState } from "react";
import {
    AppstoreOutlined,
    BankOutlined,
    DashboardOutlined,
    DownOutlined,
    LineChartOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProjectOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { Link } from "@inertiajs/react";
import { Footer } from "antd/es/layout/layout";
const { Header, Sider, Content } = Layout;
export default function AuthenticatedLayout({ auth, page, children }) {
    const [collapsed, setCollapsed] = useState(true);

    const currentRoute = route().current();

    // Admin
    const adminLinks = [
        {
            label: <Link href={route("dashboard")}>Dashboard</Link>,
            key: "admin.dashboard",
            icon: <DashboardOutlined />,
        },
    ];
    return (
        <Layout>
            <Sider
                trigger={null}
                theme="light"
                collapsible
                breakpoint="lg"
                collapsed={collapsed}
                onCollapse={(collapsedValue) => setCollapsed(collapsedValue)}
                className="m-h-[100vh] px-4"
            >
                <div className="w-full h-16 flex gap-2 items-center justify-center">
                    <img
                        className="w-16"
                        src="/images/dmo.png"
                        alt="DMO"
                    />
                </div>

                {auth.user.role === 0 && (
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        selectedKeys={[currentRoute]}
                        items={adminLinks}
                    />
                )}
            </Sider>
            <Layout>
                <Header className="w-full bg-gray-50 px-0">
                    <div className="w-full flex items-center justify-between">
                        <Button
                            type="text"
                            icon={
                                collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )
                            }
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: "16px",
                                width: 64,
                                height: 64,
                            }}
                        />
                        <div className="px-8">
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            label: (
                                                <Link
                                                    href={route("profile.edit")}
                                                >
                                                    Profile
                                                </Link>
                                            ),
                                            key: "dashboard",
                                            icon: <UserOutlined />,
                                        },
                                        {
                                            label: (
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                >
                                                    Log out
                                                </Link>
                                            ),
                                            key: "logout",
                                            icon: <LogoutOutlined />,
                                        },
                                    ],
                                }}
                                trigger={["click"]}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        {auth?.user?.name}
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <div className="p-4">
                    <Breadcrumb>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>{page}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Content className="mx-4 p-4 bg-gray-50 rounded-lg min-h-[80vh]">
                    {children}
                </Content>

                <Footer className="text-center">
                    Discover Mis Occ ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
}
