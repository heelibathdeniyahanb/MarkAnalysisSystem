using MAS.Data;
using MAS.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly TestService _testService;

        public TestController(TestService testService)
        {
            _testService = testService;
        }

        [HttpPost("add-test")]
        public async Task<IActionResult> AddTest(string testName, string? testDescription, DateOnly dateConducted, int totalMarks)
        {
            var test = await _testService.AddTestAsync(testName, testDescription, dateConducted, totalMarks);
            return Ok(test);
        }

        [HttpPut("edit-test/{testId}")]
        public async Task<IActionResult> EditTest(int testId, string testName, string? testDescription, DateOnly dateConducted, int totalMarks)
        {
            var test = await _testService.EditTestAsync(testId, testName, testDescription, dateConducted, totalMarks);
            if (test == null)
                return NotFound();

            return Ok(test);
        }

        [HttpPost("add-mark")]
        public async Task<IActionResult> AddMark(int testId, int studentId, float marksObtained, string? remarks)
        {
            var mark = await _testService.AddMarkAsync(testId, studentId, marksObtained, remarks);
            if (mark == null)
                return NotFound();

            return Ok(mark);
        }

        [HttpGet("get-test/{testId}")]
        public async Task<IActionResult> GetTest(int testId)
        {
            var test = await _testService.GetTestAsync(testId);
            if (test == null)
                return NotFound();
            return Ok(test);
        }

        [HttpGet("get-all-tests")]
        public async Task<IActionResult> GetAllTests()
        {
            var tests = await _testService.GetAllTestsAsync();
            return Ok(tests);
        }

        [HttpGet("get-student-marks/{studentId}")]
        public async Task<IActionResult> GetStudentMarks(int studentId)
        {
            var marks = await _testService.GetStudentMarksAsync(studentId);
            if (marks == null)
                return NotFound();
            return Ok(marks);
        }

        [HttpGet("get-test-marks/{testId}")]
        public async Task<IActionResult> GetTestMarks(int testId)
        {
            var marks = await _testService.GetTestMarksAsync(testId);
            if (marks == null)
                return NotFound();
            return Ok(marks);
        }
    }
}

