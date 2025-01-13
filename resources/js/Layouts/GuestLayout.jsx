
import { Carousel } from "antd";
import Avatar from "antd/es/avatar/avatar";

export default function GuestLayout({ children }) {
    return (
        <div className="h-screen w-screen relative">
            <Carousel autoplay infinite={true} className="h-full w-full">
                <div>
                    <h3 className="h-screen flex items-center justify-center text-white bg-blue-500">
                        1
                    </h3>
                </div>
                <div>
                    <h3 className="h-screen flex items-center justify-center text-white bg-red-500">
                        2
                    </h3>
                </div>
                <div>
                    <h3 className="h-screen flex items-center justify-center text-white bg-green-500">
                        3
                    </h3>
                </div>
                <div>
                    <h3 className="h-screen flex items-center justify-center text-white bg-purple-500">
                        4
                    </h3>
                </div>
            </Carousel>

            {/* Centered Form */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
