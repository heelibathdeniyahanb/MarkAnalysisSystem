namespace MAS.Dtos
{
    public class HighestAverageDto
    {
        public int? StudentId { get; set; }
        public string UserName { get; set; }
        public double AverageMarks { get; set; }
        public List<float> Marks { get; set; }
    }
}
