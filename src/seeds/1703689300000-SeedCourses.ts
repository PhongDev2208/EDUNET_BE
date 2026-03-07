import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCourses1703689300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create categories
    const categories = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        name: 'Web Development',
        slug: 'web-development',
        description: 'Learn modern web development technologies',
        icon: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg',
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'Build iOS and Android applications',
        icon: 'https://img.freepik.com/free-vector/mobile-app-development-programming-concept-illustration_114360-9027.jpg',
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        name: 'Data Science',
        slug: 'data-science',
        description: 'Master data analysis and machine learning',
        icon: 'https://img.freepik.com/free-vector/artificial-intelligence-ai-robot-chip-vector-technology-concept_53876-112302.jpg',
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        name: 'Design',
        slug: 'design',
        description: 'Learn graphic and UI/UX design',
        icon: 'https://img.freepik.com/free-vector/graphic-design-colorful-geometrical-lettering_52683-34588.jpg',
      },
    ];

    // Insert categories
    for (const cat of categories) {
      await queryRunner.query(
        `INSERT INTO "Categories" (id, name, slug, description, icon, "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
        [cat.id, cat.name, cat.slug, cat.description, cat.icon],
      );
    }

    // Insert courses
    const teacherId = '550e8400-e29b-41d4-a716-446655440002'; // Jane Teacher from SeedUsers
    const courses = [
      {
        id: '770e8400-e29b-41d4-a716-446655440001',
        title: 'Complete Web Developer Course 2024',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js and build full-stack applications',
        thumbnail: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg',
        price: 99.99,
        discountPrice: 49.99,
        duration: 24,
        totalLessons: 48,
        level: 'beginner',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        goal: 'Become a full-stack web developer',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440002',
        title: 'React Advanced Patterns',
        description: 'Master advanced React patterns and best practices for building scalable applications',
        thumbnail: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg',
        price: 79.99,
        discountPrice: 39.99,
        duration: 18,
        totalLessons: 36,
        level: 'advanced',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        goal: 'Write production-ready React applications',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440003',
        title: 'Flutter Mobile Development',
        description: 'Create beautiful and responsive mobile apps for iOS and Android',
        thumbnail: 'https://img.freepik.com/free-photo/smartphone-screen-with-code_23-2148225653.jpg',
        price: 89.99,
        discountPrice: 44.99,
        duration: 20,
        totalLessons: 40,
        level: 'intermediate',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440002',
        goal: 'Build cross-platform mobile applications',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440004',
        title: 'Python for Data Science',
        description: 'Learn Python programming and data analysis with Pandas, NumPy, and Scikit-learn',
        thumbnail: 'https://img.freepik.com/free-photo/python-programming-language-program-code-screen_53876-133553.jpg',
        price: 109.99,
        discountPrice: 54.99,
        duration: 28,
        totalLessons: 56,
        level: 'beginner',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440003',
        goal: 'Become a data analyst',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440005',
        title: 'Machine Learning Fundamentals',
        description: 'Understand machine learning algorithms and build your first ML models',
        thumbnail: 'https://img.freepik.com/free-vector/artificial-intelligence-ai-robot-chip-vector-technology-concept_53876-112302.jpg',
        price: 119.99,
        discountPrice: 59.99,
        duration: 30,
        totalLessons: 60,
        level: 'intermediate',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440003',
        goal: 'Master machine learning basics',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440006',
        title: 'UI/UX Design Principles',
        description: 'Learn user interface and user experience design principles and tools',
        thumbnail: 'https://img.freepik.com/free-photo/graphic-designer-working-tablet_23-2147652935.jpg',
        price: 69.99,
        discountPrice: 34.99,
        duration: 16,
        totalLessons: 32,
        level: 'beginner',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440004',
        goal: 'Design beautiful and user-friendly interfaces',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440007',
        title: 'Node.js & Express Backend',
        description: 'Build scalable backend applications with Node.js and Express framework',
        thumbnail: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg',
        price: 84.99,
        discountPrice: 42.99,
        duration: 22,
        totalLessons: 44,
        level: 'intermediate',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        goal: 'Build RESTful APIs and backend services',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440008',
        title: 'TypeScript Mastery',
        description: 'Learn TypeScript to write type-safe JavaScript applications',
        thumbnail: 'https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg',
        price: 74.99,
        discountPrice: 37.99,
        duration: 14,
        totalLessons: 28,
        level: 'intermediate',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        goal: 'Master TypeScript for scalable projects',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440009',
        title: 'Figma Design System',
        description: 'Create and manage design systems using Figma for professional design work',
        thumbnail: 'https://img.freepik.com/free-photo/graphic-designer-working-tablet_23-2147652935.jpg',
        price: 64.99,
        discountPrice: 32.99,
        duration: 12,
        totalLessons: 24,
        level: 'intermediate',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440004',
        goal: 'Build professional design systems',
        status: 'published',
      },
      {
        id: '770e8400-e29b-41d4-a716-446655440010',
        title: 'Cloud Computing with AWS',
        description: 'Deploy and manage applications on Amazon Web Services cloud platform',
        thumbnail: 'https://img.freepik.com/free-vector/cloud-computing-concept-illustration_114360-9027.jpg',
        price: 94.99,
        discountPrice: 47.99,
        duration: 26,
        totalLessons: 52,
        level: 'advanced',
        language: 'Vietnamese',
        categoryId: '660e8400-e29b-41d4-a716-446655440001',
        goal: 'Master cloud deployment and DevOps',
        status: 'published',
      },
    ];

    // Insert courses
    for (const course of courses) {
      await queryRunner.query(
        `INSERT INTO "Courses" (id, title, description, thumbnail, price, "discountPrice", duration, "totalLessons", level, language, goal, status, "categoryId", "teacherId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())`,
        [
          course.id,
          course.title,
          course.description,
          course.thumbnail,
          course.price,
          course.discountPrice,
          course.duration,
          course.totalLessons,
          course.level,
          course.language,
          course.goal,
          course.status,
          course.categoryId,
          teacherId,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete seeded courses
    await queryRunner.query(
      `DELETE FROM "Courses" WHERE id LIKE '770e8400-e29b-41d4-a716-446655440%'`,
    );

    // Delete seeded categories
    await queryRunner.query(
      `DELETE FROM "Categories" WHERE id LIKE '660e8400-e29b-41d4-a716-446655440%'`,
    );
  }
}
