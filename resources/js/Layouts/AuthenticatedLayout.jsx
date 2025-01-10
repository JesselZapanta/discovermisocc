import React, { useState } from "react";
import {
    DashboardOutlined,
    DownOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Menu, Space } from "antd";
import { Link } from "@inertiajs/react";
import { Footer } from "antd/es/layout/layout";
const { Header, Sider, Content } = Layout;
export default function AuthenticatedLayout({ auth, page, children }) {
    const [collapsed, setCollapsed] = useState(true);

    const currentRoute = route().current();

    // Admin
    const admin = [
        {
            label: <Link href={route("dashboard")}>Dashboard</Link>,
            key: "admin.dashboard",
            icon: <DashboardOutlined />,
        },
        {
            label: <Link href={route("admin.city")}>City</Link>,
            key: "admin.city",
            icon: <DashboardOutlined />,
        },
        {
            label: <Link href={route("admin.user")}>Users</Link>,
            key: "admin.user",
            icon: <DashboardOutlined />,
        },
    ];
    const entrepreneur = [
        {
            label: <Link href={route("dashboard")}>Dashboard</Link>,
            key: "entrepreneur.dashboard",
            icon: <DashboardOutlined />,
        },
        {
            label: <Link href={route("entrepreneur.business")}>Business</Link>,
            key: "entrepreneur.business", 
            icon: <DashboardOutlined />,
        },
    ];

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                breakpoint="lg"
                collapsed={collapsed}
                onCollapse={(collapsedValue) => setCollapsed(collapsedValue)}
                className="m-h-[100vh] px-4 bg-gray-50"
            >
                <div className="w-full h-16 flex gap-2 items-center justify-center">
                    <Link href="/">
                        <img className="w-16" src="/images/dmo.png" alt="DMO" />
                    </Link>
                </div>

                {auth.user.role === 0 && (
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        selectedKeys={[currentRoute]}
                        items={admin}
                        className="bg-gray-50"
                    />
                )}
                {auth.user.role === 3 && (
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        selectedKeys={[currentRoute]}
                        items={entrepreneur}
                        className="bg-gray-50"
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
                            className="text-[16px]"
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
                                        <Avatar
                                            size="large"
                                            icon={<UserOutlined />}
                                            src={`/storage/avatars/${auth.user.avatar}`}
                                        />
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
