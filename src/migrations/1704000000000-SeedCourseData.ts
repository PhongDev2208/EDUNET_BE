import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 * Seed dữ liệu mẫu cho hệ thống EduNet:
 * - 4 Users (1 admin, 1 student, 2 teachers)
 * - 6 Categories
 * - 8 Courses (published)
 * - 32 Lessons (mỗi khóa 3-5 bài)
 * - 6 Reviews
 * - 3 Enrollments
 */
export class SeedCourseData1704000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ==================== USERS ====================
    await queryRunner.query(`
      INSERT INTO "Users" (id, "firstName", "lastName", email, password, phone, role, avatar, bio, "isActive", "createdAt", "updatedAt")
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'EduNet', 'admin@edunet.com', $1, '0901000000', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'Quản trị viên hệ thống EduNet', true, NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440001', 'Nguyễn Văn', 'An', 'student@edunet.com', $1, '0902000001', 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student', 'Sinh viên CNTT năm 3, đam mê lập trình web', true, NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440002', 'Trần Thị', 'Hương', 'teacher@edunet.com', $1, '0903000002', 'teacher', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1', '10 năm kinh nghiệm lập trình web. Chuyên gia React, Node.js và TypeScript.', true, NOW(), NOW()),
        ('550e8400-e29b-41d4-a716-446655440003', 'Lê Quang', 'Hải', 'teacher2@edunet.com', $1, '0904000003', 'teacher', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2', 'Tiến sĩ AI, 8 năm kinh nghiệm giảng dạy Data Science và Machine Learning.', true, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // ==================== CATEGORIES ====================
    await queryRunner.query(`
      INSERT INTO "Categories" (id, name, description, image, slug, "isActive", "order", "createdAt", "updatedAt")
      VALUES
        ('a0000000-0000-4000-8000-000000000001', 'Lập trình Web', 'Học các công nghệ web hiện đại: React, Angular, Vue.js, Node.js', 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg', 'lap-trinh-web', true, 1, NOW(), NOW()),
        ('a0000000-0000-4000-8000-000000000002', 'Khoa học dữ liệu', 'Phân tích dữ liệu, Machine Learning, AI và Big Data', 'https://img.freepik.com/free-vector/data-inform-illustration-concept_114360-864.jpg', 'khoa-hoc-du-lieu', true, 2, NOW(), NOW()),
        ('a0000000-0000-4000-8000-000000000003', 'Thiết kế đồ họa', 'Figma, Adobe Photoshop, Illustrator và UI/UX Design', 'https://img.freepik.com/free-vector/graphic-design-colorful-geometrical-lettering_52683-34588.jpg', 'thiet-ke-do-hoa', true, 3, NOW(), NOW()),
        ('a0000000-0000-4000-8000-000000000004', 'Marketing', 'Digital Marketing, SEO, Social Media và Content Marketing', 'https://img.freepik.com/free-vector/marketing-consulting-concept-illustration_114360-9027.jpg', 'marketing', true, 4, NOW(), NOW()),
        ('a0000000-0000-4000-8000-000000000005', 'Kinh doanh', 'Quản trị kinh doanh, Tài chính và Khởi nghiệp', 'https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg', 'kinh-doanh', true, 5, NOW(), NOW()),
        ('a0000000-0000-4000-8000-000000000006', 'Ngoại ngữ', 'Tiếng Anh, Tiếng Nhật, Tiếng Hàn và các ngôn ngữ khác', 'https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg', 'ngoai-ngu', true, 6, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // ==================== COURSES ====================
    await queryRunner.query(`
      INSERT INTO "Courses" (id, title, description, thumbnail, price, "discountPrice", duration, "totalLessons", "totalStudents", rating, "totalReviews", status, level, language, goal, tags, "categoryId", "teacherId", "publishedAt", "createdAt", "updatedAt")
      VALUES
        (
          'b0000000-0000-4000-8000-000000000001',
          'React & TypeScript - Xây dựng ứng dụng web hiện đại',
          'Khóa học toàn diện về React 19 kết hợp TypeScript. Bạn sẽ học cách xây dựng ứng dụng web SPA hiện đại với hooks, context, Redux Toolkit, RTK Query và các best practices trong ngành.',
          'https://img.freepik.com/free-vector/programmer-working-web-development-code-engineer-programming-python-php-java-script-computer_90220-249.jpg',
          49.99, 39.99, '11h 00m', 5, 156, 4.7, 2, 'published', 'intermediate', 'Vietnamese',
          'Thành thạo React 19 + TypeScript, xây dựng ứng dụng SPA hoàn chỉnh, sử dụng Redux Toolkit & RTK Query',
          'React,TypeScript,Redux,Frontend',
          'a0000000-0000-4000-8000-000000000001', '550e8400-e29b-41d4-a716-446655440002',
          NOW() - INTERVAL '30 days', NOW() - INTERVAL '60 days', NOW()
        ),
        (
          'b0000000-0000-4000-8000-000000000002',
          'Node.js Backend Master - Từ zero đến hero',
          'Học xây dựng REST API chuyên nghiệp với Node.js, Express.js và NestJS. Bao gồm authentication, database, testing và deployment.',
          'https://img.freepik.com/free-vector/hand-drawn-web-developers_23-2148819604.jpg',
          59.99, NULL, '8h 00m', 4, 98, 4.5, 0, 'published', 'intermediate', 'Vietnamese',
          'Xây dựng REST API với Express.js & NestJS, kết nối database PostgreSQL, triển khai authentication JWT',
          'Node.js,Express,NestJS,Backend',
          'a0000000-0000-4000-8000-000000000001', '550e8400-e29b-41d4-a716-446655440002',
          NOW() - INTERVAL '25 days', NOW() - INTERVAL '55 days', NOW()
        ),
        (
          'b0000000-0000-4000-8000-000000000003',
          'Python cho Data Science & Machine Learning',
          'Từ Python cơ bản đến Machine Learning nâng cao. Học cách phân tích dữ liệu với Pandas, trực quan hóa với Matplotlib và xây dựng mô hình ML với Scikit-learn.',
          'https://img.freepik.com/free-vector/data-processing-concept-illustration_114360-4781.jpg',
          69.99, 49.99, '12h 30m', 5, 234, 4.8, 1, 'published', 'beginner', 'Vietnamese',
          'Sử dụng Python cho phân tích dữ liệu, xây dựng mô hình Machine Learning, trực quan hóa dữ liệu chuyên nghiệp',
          'Python,Data Science,Machine Learning,AI',
          'a0000000-0000-4000-8000-000000000002', '550e8400-e29b-41d4-a716-446655440003',
          NOW() - INTERVAL '20 days', NOW() - INTERVAL '50 days', NOW()
        ),
        (
          'b0000000-0000-4000-8000-000000000004',
          'UI/UX Design - Thiết kế giao diện chuyên nghiệp',
          'Học thiết kế UX/UI từ cơ bản đến nâng cao với Figma. Bao gồm Design System, Prototyping, User Research và Usability Testing.',
          'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg',
          39.99, NULL, '6h 00m', 3, 189, 4.6, 1, 'published', 'beginner', 'Vietnamese',
          'Thiết kế giao diện với Figma, xây dựng Design System, phương pháp User Research chuyên nghiệp',
          'UI/UX,Figma,Design,Prototyping',
          'a0000000-0000-4000-8000-000000000003', '550e8400-e29b-41d4-a716-446655440002',
          NOW() - INTERVAL '15 days', NOW() - INTERVAL '45 days', NOW()
        ),
        (
          'b0000000-0000-4000-8000-000000000005',
          'Digital Marketing từ A đến Z',
          'Khóa học marketing online toàn diện: SEO, Google Ads, Facebook Ads, Content Marketing và Email Marketing. Thực hành trên các dự án thực tế.',
          'https://img.freepik.com/free-vector/digital-marketing-team-with-laptops-light-bulb-marketing-team-metrics-marketing-team-lead-responsibilities-concept_335657-2068.jpg',
          44.99, 34.99, '7h 30m', 3, 145, 4.4, 1, 'published', 'beginner', 'Vietnamese',
          'Chạy quảng cáo Google Ads & Facebook Ads, tối ưu SEO website, xây dựng chiến lược Content Marketing',
          'Marketing,SEO,Google Ads,Facebook Ads',
          'a0000000-0000-4000-8000-000000000004', '550e8400-e29b-41d4-a716-446655440003',
          NOW() - INTERVAL '10 days', NOW() - INTERVAL '40 days', NOW()
        ),
        (
          'b0000000-0000-4000-8000-000000000006',
          'Fullstack JavaScript - MERN Stack',
          'Xây dựng ứng dụng fullstack hoàn chỉnh với MongoDB, Express.js, React và Node.js. Từ thiết kế database đến deploy lên production.',
          'https://img.freepik.com/free-vector/code-testing-concept-illustration_114360-8813.jpg',
          79.99, 59.99, '15h 00m', 5, 312, 4.9, 1, 'published', 'intermediate', 'Vietnamese',
          'Xây dựng ứng dụng MERN Stack hoàn chỉnh, thiết kế RESTful API, deploy lên production',
          'JavaScript,MERN,MongoDB,Express,React,Node.js',
          'a0000000-0000-4000-8000-000000000001', '550e8400-e29b-41d4-a716-446655440002',
          NOW() - INTERVAL '5 days', NOW() - INTERVAL '35 days', NOW()
        ),
        (
          'b0000000-0000-4000-8000-000000000007',
          'Business English - Giao tiếp thương mại',
          'Nâng cao kỹ năng tiếng Anh thương mại: viết email, thuyết trình, đàm phán và giao tiếp trong môi trường quốc tế.',
          'https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg',
          29.99, NULL, '5h 30m', 3, 87, 4.3, 0, 'published', 'all', 'Vietnamese',
          'Viết email chuyên nghiệp, thuyết trình bằng tiếng Anh, kỹ năng đàm phán quốc tế',
          'English,Business,Communication',
          'a0000000-0000-4000-8000-000000000006', '550e8400-e29b-41d4-a716-446655440003',
          NOW() - INTERVAL '3 days', NOW() - INTERVAL '30 days', NOW()
        ),
        (
          'b0000000-0000-4000-8000-000000000008',
          'Khởi nghiệp - Từ ý tưởng đến thực tế',
          'Học cách biến ý tưởng thành doanh nghiệp: Business Model Canvas, Lean Startup, gọi vốn và quản lý tài chính.',
          'https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg',
          54.99, NULL, '8h 30m', 4, 76, 4.5, 0, 'published', 'all', 'Vietnamese',
          'Xây dựng Business Model Canvas, phương pháp Lean Startup, chiến lược gọi vốn',
          'Startup,Business,Finance',
          'a0000000-0000-4000-8000-000000000005', '550e8400-e29b-41d4-a716-446655440002',
          NOW() - INTERVAL '1 day', NOW() - INTERVAL '25 days', NOW()
        )
      ON CONFLICT (id) DO NOTHING
    `);

    // ==================== LESSONS ====================
    // Course 1: React & TypeScript (5 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000101', 'Giới thiệu React & TypeScript', 'Tổng quan về React 19, cách cài đặt project với Vite và TypeScript, cấu trúc folder.', 'Nội dung bài học giới thiệu React & TypeScript', 'video', '1h 30m', 1, true, 'b0000000-0000-4000-8000-000000000001', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000102', 'JSX và Component cơ bản', 'Cú pháp JSX, tạo Functional Component, Props và PropTypes với TypeScript.', 'Nội dung bài học JSX và Component', 'video', '2h 00m', 2, true, 'b0000000-0000-4000-8000-000000000001', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000103', 'React Hooks - useState & useEffect', 'Quản lý state với useState, side effects với useEffect, cleanup functions.', 'Nội dung React Hooks', 'video', '2h 30m', 3, false, 'b0000000-0000-4000-8000-000000000001', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000104', 'Custom Hooks & Context API', 'Tạo custom hooks, chia sẻ logic, Context API cho state management.', 'Nội dung Custom Hooks & Context', 'video', '2h 00m', 4, false, 'b0000000-0000-4000-8000-000000000001', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000105', 'Redux Toolkit & RTK Query', 'State management với Redux Toolkit, data fetching với RTK Query.', 'Nội dung Redux Toolkit & RTK Query', 'video', '3h 00m', 5, false, 'b0000000-0000-4000-8000-000000000001', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // Course 2: Node.js Backend (4 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000201', 'Giới thiệu Node.js & NPM', 'Tổng quan Node.js runtime, NPM packages, ES Modules.', 'Nội dung giới thiệu Node.js', 'video', '1h 30m', 1, true, 'b0000000-0000-4000-8000-000000000002', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000202', 'Express.js Fundamentals', 'Routes, Middleware, Error handling, Request/Response.', 'Nội dung Express.js Fundamentals', 'video', '2h 00m', 2, true, 'b0000000-0000-4000-8000-000000000002', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000203', 'NestJS Architecture', 'Modules, Controllers, Services, Dependency Injection.', 'Nội dung NestJS Architecture', 'video', '2h 30m', 3, false, 'b0000000-0000-4000-8000-000000000002', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000204', 'Database với TypeORM', 'Entities, Relations, Migrations, QueryBuilder.', 'Nội dung Database với TypeORM', 'video', '2h 00m', 4, false, 'b0000000-0000-4000-8000-000000000002', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // Course 3: Python Data Science (5 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000301', 'Python cơ bản cho Data Science', 'Cú pháp Python, Data types, Control flow, Functions.', 'Nội dung Python cơ bản', 'video', '1h 30m', 1, true, 'b0000000-0000-4000-8000-000000000003', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000302', 'NumPy - Xử lý mảng và ma trận', 'ndarray, Broadcasting, Linear Algebra operations.', 'Nội dung NumPy', 'video', '2h 00m', 2, false, 'b0000000-0000-4000-8000-000000000003', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000303', 'Pandas - Phân tích dữ liệu', 'DataFrame, Series, Data cleaning, Aggregation.', 'Nội dung Pandas', 'video', '3h 00m', 3, false, 'b0000000-0000-4000-8000-000000000003', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000304', 'Matplotlib & Seaborn', 'Data visualization, Charts, Heatmaps, Statistical plots.', 'Nội dung Matplotlib & Seaborn', 'video', '2h 00m', 4, false, 'b0000000-0000-4000-8000-000000000003', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000305', 'Scikit-learn - ML cơ bản', 'Classification, Regression, Clustering, Model evaluation.', 'Nội dung Scikit-learn', 'video', '3h 00m', 5, false, 'b0000000-0000-4000-8000-000000000003', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // Course 4: UI/UX Design (3 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000401', 'Giới thiệu UI/UX Design', 'Principles of Design, User-Centered Design, các tools, Figma interface.', 'Nội dung giới thiệu UI/UX', 'video', '1h 00m', 1, true, 'b0000000-0000-4000-8000-000000000004', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000402', 'User Research & Wireframing', 'Phỏng vấn người dùng, tạo personas, wireframes và user flows.', 'Nội dung User Research', 'video', '2h 30m', 2, false, 'b0000000-0000-4000-8000-000000000004', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000403', 'Design System & Prototyping', 'Xây dựng Design System, Components, Auto Layout, Interactive Prototype.', 'Nội dung Design System', 'video', '2h 30m', 3, false, 'b0000000-0000-4000-8000-000000000004', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // Course 5: Digital Marketing (3 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000501', 'Tổng quan Digital Marketing', 'Các kênh marketing online, chiến lược tổng thể, đo lường hiệu quả.', 'Nội dung tổng quan Digital Marketing', 'video', '2h 00m', 1, true, 'b0000000-0000-4000-8000-000000000005', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000502', 'SEO & Content Marketing', 'On-page SEO, Off-page SEO, keyword research, content strategy.', 'Nội dung SEO & Content Marketing', 'video', '3h 00m', 2, false, 'b0000000-0000-4000-8000-000000000005', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000503', 'Google Ads & Facebook Ads', 'Tạo campaign, targeting, bidding strategies, analytics.', 'Nội dung Google Ads & Facebook Ads', 'video', '2h 30m', 3, false, 'b0000000-0000-4000-8000-000000000005', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // Course 6: Fullstack MERN (5 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000601', 'Giới thiệu MERN Stack', 'Tổng quan kiến trúc MERN, setup môi trường phát triển.', 'Nội dung giới thiệu MERN', 'video', '1h 30m', 1, true, 'b0000000-0000-4000-8000-000000000006', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000602', 'MongoDB & Mongoose', 'Schema design, CRUD operations, Aggregation pipeline.', 'Nội dung MongoDB & Mongoose', 'video', '3h 00m', 2, false, 'b0000000-0000-4000-8000-000000000006', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000603', 'Express.js REST API', 'RESTful API design, Authentication, Middleware, Error handling.', 'Nội dung Express.js REST API', 'video', '3h 00m', 3, false, 'b0000000-0000-4000-8000-000000000006', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000604', 'React Frontend', 'React Router, State management, API integration, Form handling.', 'Nội dung React Frontend', 'video', '4h 00m', 4, false, 'b0000000-0000-4000-8000-000000000006', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000605', 'Deploy & Production', 'Docker, CI/CD, Nginx, Environment config, Monitoring.', 'Nội dung Deploy & Production', 'video', '3h 30m', 5, false, 'b0000000-0000-4000-8000-000000000006', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // Course 7: Business English (3 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000701', 'Business Email Writing', 'Cấu trúc email chuyên nghiệp, từ vựng thương mại, templates phổ biến.', 'Nội dung Business Email', 'video', '1h 30m', 1, true, 'b0000000-0000-4000-8000-000000000007', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000702', 'Presentation Skills', 'Cấu trúc bài thuyết trình, opening & closing, handling Q&A.', 'Nội dung Presentation Skills', 'video', '2h 00m', 2, false, 'b0000000-0000-4000-8000-000000000007', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000703', 'Negotiation & Meeting', 'Kỹ năng đàm phán, điều hành cuộc họp, từ vựng thương lượng.', 'Nội dung Negotiation & Meeting', 'video', '2h 00m', 3, false, 'b0000000-0000-4000-8000-000000000007', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // Course 8: Khởi nghiệp (4 lessons)
    await queryRunner.query(`
      INSERT INTO "Lessons" (id, title, description, content, type, duration, "order", "isFree", "courseId", "createdAt", "updatedAt")
      VALUES
        ('c0000000-0000-4000-8000-000000000801', 'Tìm ý tưởng kinh doanh', 'Phương pháp brainstorm, phân tích thị trường, đánh giá ý tưởng.', 'Nội dung tìm ý tưởng', 'video', '2h 00m', 1, true, 'b0000000-0000-4000-8000-000000000008', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000802', 'Business Model Canvas', 'Xây dựng BMC, Value Proposition, Revenue Streams.', 'Nội dung BMC', 'video', '2h 30m', 2, false, 'b0000000-0000-4000-8000-000000000008', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000803', 'Lean Startup & MVP', 'Build-Measure-Learn, tạo MVP, pivot strategy.', 'Nội dung Lean Startup', 'video', '2h 00m', 3, false, 'b0000000-0000-4000-8000-000000000008', NOW(), NOW()),
        ('c0000000-0000-4000-8000-000000000804', 'Gọi vốn & Tài chính', 'Pitch deck, các nguồn vốn, quản lý tài chính startup.', 'Nội dung gọi vốn', 'video', '2h 00m', 4, false, 'b0000000-0000-4000-8000-000000000008', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // ==================== REVIEWS ====================
    await queryRunner.query(`
      INSERT INTO "Reviews" (id, rating, comment, "isVisible", "courseId", "userId", "createdAt", "updatedAt")
      VALUES
        ('d0000000-0000-4000-8000-000000000001', 5, 'Khóa học rất tuyệt vời! Giảng viên giải thích rõ ràng, dễ hiểu. Tôi đã học được rất nhiều về React và TypeScript.', true, 'b0000000-0000-4000-8000-000000000001', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '10 days', NOW()),
        ('d0000000-0000-4000-8000-000000000002', 4, 'Nội dung tốt, cần thêm bài tập thực hành. Nhìn chung rất hài lòng với khóa học.', true, 'b0000000-0000-4000-8000-000000000001', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '8 days', NOW()),
        ('d0000000-0000-4000-8000-000000000003', 5, 'Khóa Python hay nhất mà tôi từng học. Bài tập thực hành rất phong phú và thực tế.', true, 'b0000000-0000-4000-8000-000000000003', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '7 days', NOW()),
        ('d0000000-0000-4000-8000-000000000004', 4, 'Khóa học Figma rất dễ theo dõi, phù hợp cho người mới bắt đầu. Giảng viên nhiệt tình.', true, 'b0000000-0000-4000-8000-000000000004', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days', NOW()),
        ('d0000000-0000-4000-8000-000000000005', 5, 'MERN Stack được giảng dạy rất bài bản. Sau khóa học tôi đã có thể tự xây dựng ứng dụng riêng.', true, 'b0000000-0000-4000-8000-000000000006', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days', NOW()),
        ('d0000000-0000-4000-8000-000000000006', 4, 'Kiến thức marketing cập nhật, thực tế. Giảng viên chia sẻ nhiều case study hay.', true, 'b0000000-0000-4000-8000-000000000005', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day', NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    // ==================== ENROLLMENTS ====================
    await queryRunner.query(`
      INSERT INTO "Enrollments" (id, "courseId", "userId", status, progress, "createdAt", "updatedAt")
      VALUES
        ('e0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', '550e8400-e29b-41d4-a716-446655440001', 'active', 65, NOW() - INTERVAL '20 days', NOW()),
        ('e0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000003', '550e8400-e29b-41d4-a716-446655440001', 'active', 30, NOW() - INTERVAL '15 days', NOW()),
        ('e0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000006', '550e8400-e29b-41d4-a716-446655440001', 'active', 10, NOW() - INTERVAL '5 days', NOW())
      ON CONFLICT (id) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "Enrollments" WHERE id LIKE 'e0000000-0000-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM "Reviews" WHERE id LIKE 'd0000000-0000-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM "Lessons" WHERE id LIKE 'c0000000-0000-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM "Courses" WHERE id LIKE 'b0000000-0000-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM "Categories" WHERE id LIKE 'a0000000-0000-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM "Users" WHERE email IN ('admin@edunet.com', 'student@edunet.com', 'teacher@edunet.com', 'teacher2@edunet.com')`);
  }
}
