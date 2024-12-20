import { Link } from "react-router-dom";
import { Button, Card, Image } from "@nextui-org/react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Card className="w-full max-w-xl p-8 shadow-xl bg-white/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="space-y-8"
        >
          {/* Biểu tượng có hình ảnh động */}
          <motion.div
            className="flex justify-center"
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="https://cdn-icons-png.flaticon.com/512/6195/6195678.png"
              alt="404"
              className="w-40 h-40 drop-shadow-xl"
            />
          </motion.div>

          {/* Nội dung văn bản có hiệu ứng */}
          <motion.div
            className="text-center space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              404
            </motion.h1>
            <motion.h2
              className="text-2xl font-semibold text-gray-800"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Oops! Trang không tồn tại
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-md mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại. Vui
              lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
            </motion.p>
          </motion.div>

          {/* Nút có hiệu ứng di chuột và chạm */}
          <motion.div
            className="flex justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                as={Link}
                to="/"
                color="primary"
                variant="shadow"
                size="lg"
                className="font-semibold px-8"
              >
                Quay về trang chủ
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Card>
    </div>
  );
};

export default NotFound;
