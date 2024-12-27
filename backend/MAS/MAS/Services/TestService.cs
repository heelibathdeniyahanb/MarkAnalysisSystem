using MAS.Data;
using MAS.Models;
using Microsoft.EntityFrameworkCore;

namespace MAS.Services
{
    public class TestService
    {
        private readonly DatabaseContext _context;

            public TestService(DatabaseContext dbContext)
            {
                _context = dbContext;
            }

            // Add a new test
            public async Task<Test> AddTestAsync(string testName, string? testDescription, DateOnly dateConducted, int totalMarks)
            {
                var test = new Test
                {
                    TestName = testName,
                    TestDescription = testDescription,
                    DateConducted = dateConducted,
                    TotalMarks = totalMarks
                };

                _context.Tests.Add(test);
                await _context.SaveChangesAsync();

                return test;
            }

            // Edit an existing test
            public async Task<Test?> EditTestAsync(int testId, string testName, string? testDescription, DateOnly dateConducted, int totalMarks)
            {
                var test = await _context.Tests.FindAsync(testId);
                if (test == null) return null;

                test.TestName = testName;
                test.TestDescription = testDescription;
                test.DateConducted = dateConducted;
                test.TotalMarks = totalMarks;

                await _context.SaveChangesAsync();
                return test;
            }

        // Get a specific test with its marks
        public async Task<Test?> GetTestAsync(int testId)
        {
            return await _context.Tests
                .Include(t => t.Marks)
                    .ThenInclude(m => m.Student)
                .FirstOrDefaultAsync(t => t.Id == testId);
        }

        // Get all tests with their marks
        public async Task<List<object>> GetAllTestsAsync()
        {
            var tests = await _context.Tests
                .Include(t => t.Marks)
                    .ThenInclude(m => m.Student)
                .Select(t => new
                {
                    TestId = t.Id,
                    TestName = t.TestName,
                    TestDescription = t.TestDescription,
                    DateConducted = t.DateConducted,
                    TotalMarks = t.TotalMarks,
                    Students = t.Marks.Select(m => new
                    {
                        StudentId = m.Student.StudentId,
                        StudentName = $"{m.Student.FirstName} {m.Student.LastName}",
                        MarksObtained = m.MarksObtained,
                        Percentage = (m.MarksObtained / t.TotalMarks) * 100
                    }).ToList()
                })
                .ToListAsync();

            return tests.Cast<object>().ToList(); // Ensure compatibility with the List<object> return type
        }


        // Add marks for a student in a test
        public async Task<Mark?> AddMarkAsync(int testId, int studentId, float marksObtained, string? remarks)
        {
            // Find the student by StudentId and ensure they are a student
            var student = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.StudentId == studentId &&
                    u.Role == User.UserRole.Student);

            var test = await _context.Tests.FindAsync(testId);

            if (test == null || student == null)
                return null;

            var mark = new Mark
            {
                TestId = testId,
                StudentId = student.Id, // Use the primary key Id for the foreign key
                MarksObtained = marksObtained,
                Remarks = remarks
            };

            _context.Marks.Add(mark);
            await _context.SaveChangesAsync();
            return mark;
        }

        // Get marks for a specific student
        public async Task<object?> GetStudentMarksAsync(int studentId)
        {
            var student = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.StudentId == studentId &&
                    u.Role == User.UserRole.Student);

            if (student == null)
                return null;

            var marks = await _context.Marks
                .Where(m => m.StudentId == student.Id)
                .Include(m => m.Test)
                .Select(m => new
                {
                    TestId = m.TestId,
                    TestName = m.Test.TestName,
                    TestDescription = m.Test.TestDescription,
                    DateConducted = m.Test.DateConducted,
                    TotalMarks = m.Test.TotalMarks,
                    MarksObtained = m.MarksObtained,
                    Remarks = m.Remarks,
                    Percentage = (m.MarksObtained / m.Test.TotalMarks) * 100
                })
                .ToListAsync();

            return new
            {
                StudentId = studentId,
                StudentName = $"{student.FirstName} {student.LastName}",
                Email = student.Email,
                Marks = marks
            };
        }

        // Get all marks for a specific test
        public async Task<object?> GetTestMarksAsync(int testId)
        {
            var test = await _context.Tests
                .FirstOrDefaultAsync(t => t.Id == testId);

            if (test == null)
                return null;

            var marks = await _context.Marks
                .Where(m => m.TestId == testId)
                .Include(m => m.Student)
                .Select(m => new
                {
                    StudentId = m.Student.StudentId,
                    StudentName = $"{m.Student.FirstName} {m.Student.LastName}",
                    Email = m.Student.Email,
                    MarksObtained = m.MarksObtained,
                    Remarks = m.Remarks,
                    Percentage = (m.MarksObtained / test.TotalMarks) * 100
                })
                .OrderByDescending(m => m.MarksObtained)
                .ToListAsync();

            return new
            {
                TestId = testId,
                TestName = test.TestName,
                TestDescription = test.TestDescription,
                DateConducted = test.DateConducted,
                TotalMarks = test.TotalMarks,
                NumberOfStudents = marks.Count,
                AverageScore = marks.Any() ? marks.Average(m => m.MarksObtained) : 0,
                HighestScore = marks.Any() ? marks.Max(m => m.MarksObtained) : 0,
                LowestScore = marks.Any() ? marks.Min(m => m.MarksObtained) : 0,
                Marks = marks
            };
        }
    }
    }


